import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pikrxkxpizdezazlwxhb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpa3J4a3hwaXpkZXphemx3eGhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NTA3MzYsImV4cCI6MjA4ODIyNjczNn0.ErrKxQfek7x6Wc1ICyuRwFVVS2cygU20L20L61kqSVY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAuth() {
  try {
    console.log('Testing authentication...');
    console.log('Email: mikerbrooke@outlook.com');
    console.log('Password: Linda2024!');
    console.log('');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'mikerbrooke@outlook.com',
      password: 'Linda2024!'
    });
    
    if (error) {
      console.error('❌ Authentication failed:');
      console.error('Error:', error.message);
      console.error('Status:', error.status);
      console.error('Code:', error.code);
    } else {
      console.log('✅ Authentication successful!');
      console.log('User ID:', data.user?.id);
      console.log('Email:', data.user?.email);
      console.log('Session expires:', data.session?.expires_at);
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testAuth();
