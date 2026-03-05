import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables');
  console.error('Required: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createTestUser() {
  try {
    console.log('Creating test user...');

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'mikerbrooke@outlook.com',
      password: 'Linda',
      email_confirm: true,
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      return;
    }

    console.log('✓ Auth user created:', authData.user.id);

    // Create user profile in users table
    const { error: profileError } = await supabase.from('users').insert({
      id: authData.user.id,
      email: 'mikerbrooke@outlook.com',
      first_name: 'Mike',
      last_name: 'Brooke',
      cellphone: '021-123-4567',
      role: 'admin',
      active: true,
      created_at: new Date().toISOString(),
    });

    if (profileError) {
      console.error('Error creating user profile:', profileError);
      return;
    }

    console.log('✓ User profile created');
    console.log('\nTest user created successfully!');
    console.log('Email: mikerbrooke@outlook.com');
    console.log('Password: Linda');
    console.log('Role: admin');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createTestUser();
