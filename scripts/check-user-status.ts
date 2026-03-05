import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pikrxkxpizdezazlwxhb.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkUserStatus() {
  try {
    console.log('Checking user status...');
    
    // Get user from auth.users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error fetching auth users:', authError);
      return;
    }
    
    console.log('\nAuth users found:', authUsers.users.length);
    
    const user = authUsers.users.find(u => u.email === 'mikerbrooke@outlook.com');
    
    if (user) {
      console.log('\nUser details:');
      console.log('- ID:', user.id);
      console.log('- Email:', user.email);
      console.log('- Email confirmed:', user.email_confirmed_at ? 'YES' : 'NO');
      console.log('- Created at:', user.created_at);
      console.log('- Last sign in:', user.last_sign_in_at);
      
      // Check if user exists in public.users table
      const { data: publicUser, error: publicError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (publicError) {
        console.error('\nError fetching public user:', publicError);
      } else {
        console.log('\nPublic user record:');
        console.log('- Name:', publicUser.name);
        console.log('- Role:', publicUser.role);
        console.log('- Active:', publicUser.is_active);
      }
    } else {
      console.log('\nUser not found in auth.users!');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkUserStatus();
