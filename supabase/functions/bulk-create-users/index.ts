import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')

    // Verify the user is authenticated and is an admin
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if user is admin
    const { data: userData } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userData?.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Forbidden: Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get the users array from request body
    const { users } = await req.json()

    if (!Array.isArray(users) || users.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid request: users array required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [] as any[],
      created_users: [] as any[],
    }

    // Process each user
    for (const userData of users) {
      try {
        const { email, password, first_name, last_name, role, active, cellphone, team_name } = userData

        // Validate required fields
        if (!email || !first_name || !last_name) {
          results.failed++
          results.errors.push({ email, error: 'Missing required fields' })
          continue
        }

        // Create user in Supabase Auth
        const { data: authData, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email,
          password: password || Math.random().toString(36).slice(-12),
          email_confirm: true,
          user_metadata: {
            first_name,
            last_name,
          },
        })

        if (createError) {
          results.failed++
          results.errors.push({ email, error: createError.message })
          continue
        }

        // Create user record in users table
        const { error: userError } = await supabaseAdmin
          .from('users')
          .insert({
            id: authData.user.id,
            email,
            first_name,
            last_name,
            cellphone: cellphone || null,
            role: role || 'player',
            active: active !== false,
          })

        if (userError) {
          // Rollback: delete auth user
          await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
          results.failed++
          results.errors.push({ email, error: userError.message })
          continue
        }

        // Add to team if team_name provided
        if (team_name) {
          const { data: teamData } = await supabaseAdmin
            .from('teams')
            .select('id')
            .ilike('name', `%${team_name}%`)
            .single()

          if (teamData) {
            await supabaseAdmin
              .from('team_members')
              .insert({
                team_id: teamData.id,
                user_id: authData.user.id,
                role: role === 'coach' ? 'coach' : 'player',
              })
          }
        }

        results.success++
        results.created_users.push({
          id: authData.user.id,
          email,
          first_name,
          last_name,
        })

      } catch (error) {
        results.failed++
        results.errors.push({ email: userData.email, error: error.message })
      }
    }

    return new Response(
      JSON.stringify(results),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
