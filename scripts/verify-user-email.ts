import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pikrxkxpizdezazlwxhb.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyUser() {
  try {
    console.log('Testing login with anon key...');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'mikerbrooke@outlook.com',
      password: 'Linda2024!'
    });
    
    if (error) {
      console.error('❌ Login failed:', error.message);
      console.error('Error code:', error.code);
      console.error('Error status:', error.status);
    } else {
      console.log('✅ Login successful!');
      console.log('User ID:', data.user?.id);
      console.log('Email:', data.user?.email);
      console.log('Email confirmed:', data.user?.email_confirmed_at ? 'YES' : 'NO');
      console.log('Session expires:', new Date(data.session?.expires_at! * 1000).toLocaleString());
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

verifyUser();
