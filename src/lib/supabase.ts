import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase config:', { supabaseUrl, supabaseAnonKey: supabaseAnonKey ? 'exists' : 'missing' });

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create client with default settings (Supabase handles storage automatically)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
