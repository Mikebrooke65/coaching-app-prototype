import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function recreateTestUser() {
  try {
    console.log('Deleting old user if exists...');
    
    // Try to delete the old user
    const { error: deleteError } = await supabase.auth.admin.deleteUser(
      'ab8a7dbc-9943-4e12-a372-e977a4a5674a'
    );
    
    if (deleteError) {
      console.log('No old user to delete or error:', deleteError.message);
    } else {
      console.log('✓ Old user deleted');
    }

    console.log('Creating new test user...');

    // Create new auth user with stronger password
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'mikerbrooke@outlook.com',
      password: 'Linda2024!',
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
    console.log('\n✅ Test user created successfully!');
    console.log('Email: mikerbrooke@outlook.com');
    console.log('Password: Linda2024!');
    console.log('Role: admin');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

recreateTestUser();
