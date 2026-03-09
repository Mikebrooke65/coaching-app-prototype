import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

export const handler: Handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Get user's JWT from Authorization header
    const authHeader = event.headers.authorization;
    if (!authHeader) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Missing authorization header' }),
      };
    }

    const token = authHeader.replace('Bearer ', '');

    // Get environment variables
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Server configuration error' }),
      };
    }

    // Create Supabase client with user's token to verify they're authenticated
    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Unauthorized' }),
      };
    }

    // Create admin client
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user is admin
    const { data: userData } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userData?.role !== 'admin') {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ error: 'Admin access required' }),
      };
    }

    // Parse request body
    const body = JSON.parse(event.body || '{}');
    const { users } = body;

    if (!Array.isArray(users) || users.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid request: users array required' }),
      };
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [] as any[],
      created_users: [] as any[],
    };

    // Process each user
    for (const userData of users) {
      try {
        const { email, password, first_name, last_name, role, active, cellphone, team_name } = userData;

        // Validate required fields
        if (!email || !first_name || !last_name) {
          results.failed++;
          results.errors.push({ email, error: 'Missing required fields' });
          continue;
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
        });

        if (createError) {
          results.failed++;
          results.errors.push({ email, error: createError.message });
          continue;
        }

        const newUserId = authData.user.id;

        // Create user record in users table
        const { error: userError } = await supabaseAdmin
          .from('users')
          .insert({
            id: newUserId,
            email,
            first_name,
            last_name,
            cellphone: cellphone || null,
            role: role || 'player',
            active: active !== false,
          });

        if (userError) {
          // Rollback: delete auth user
          await supabaseAdmin.auth.admin.deleteUser(newUserId);
          results.failed++;
          results.errors.push({ email, error: userError.message });
          continue;
        }

        // Add to team if team_name provided
        if (team_name) {
          const { data: teamData } = await supabaseAdmin
            .from('teams')
            .select('id')
            .ilike('name', `%${team_name}%`)
            .single();

          if (teamData) {
            await supabaseAdmin
              .from('team_members')
              .insert({
                team_id: teamData.id,
                user_id: newUserId,
                role: role === 'coach' ? 'coach' : 'player',
              });
          }
        }

        results.success++;
        results.created_users.push({
          id: newUserId,
          email,
          first_name,
          last_name,
        });

      } catch (error: any) {
        results.failed++;
        results.errors.push({ email: userData.email, error: error.message });
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(results),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
