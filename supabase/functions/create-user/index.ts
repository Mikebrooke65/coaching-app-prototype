// Edge function for creating users

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
    const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Extract user ID from JWT
    const token = authHeader.replace('Bearer ', '')
    const parts = token.split('.')
    if (parts.length !== 3) {
      return new Response(
        JSON.stringify({ error: 'Malformed token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let userId: string
    try {
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
      userId = payload.sub
      if (!userId) throw new Error('No sub in payload')
    } catch (e) {
      return new Response(
        JSON.stringify({ error: 'Could not extract user ID from token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if user is admin
    const roleCheckResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/users?id=eq.${userId}&select=role`,
      {
        headers: {
          'Authorization': `Bearer ${SERVICE_KEY}`,
          'apikey': SERVICE_KEY,
        },
      }
    )

    const roleData = await roleCheckResponse.json()
    if (!Array.isArray(roleData) || roleData.length === 0 || roleData[0].role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get request body
    const body = await req.json()
    const { email, password, first_name, last_name, role, active, cellphone, team_id } = body

    if (!email || !first_name || !last_name) {
      return new Response(
        JSON.stringify({ error: 'Email, first_name, and last_name are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create auth user
    const createAuthResponse = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'apikey': SERVICE_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password: password || Math.random().toString(36).slice(-12),
        email_confirm: true,
        user_metadata: { first_name, last_name },
      }),
    })

    if (!createAuthResponse.ok) {
      const error = await createAuthResponse.json()
      return new Response(
        JSON.stringify({ error: error.msg || error.message || 'Failed to create auth user' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const authUser = await createAuthResponse.json()
    const newUserId = authUser.id

    // Create user record
    const createUserResponse = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'apikey': SERVICE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        id: newUserId,
        email,
        first_name,
        last_name,
        cellphone: cellphone || null,
        role: role || 'player',
        active: active !== false,
      }),
    })

    if (!createUserResponse.ok) {
      // Rollback: delete auth user
      await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${newUserId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${SERVICE_KEY}`,
          'apikey': SERVICE_KEY,
        },
      })
      
      const error = await createUserResponse.json()
      return new Response(
        JSON.stringify({ error: error.message || 'Failed to create user record' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Add to team if provided
    if (team_id) {
      await fetch(`${SUPABASE_URL}/rest/v1/team_members`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SERVICE_KEY}`,
          'apikey': SERVICE_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          team_id,
          user_id: newUserId,
          role: role === 'coach' ? 'coach' : 'player',
        }),
      })
    }

    return new Response(
      JSON.stringify({
        success: true,
        user: { id: newUserId, email, first_name, last_name },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
