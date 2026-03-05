import { supabase } from '../supabase';

/**
 * Simple connection test for Supabase
 * Run this to verify the Supabase client is configured correctly
 */
export async function testSupabaseConnection() {
  try {
    // Test 1: Check if client is initialized
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }
    console.log('✓ Supabase client initialized');

    // Test 2: Try to fetch skills (should work with RLS policies)
    const { data: skills, error: skillsError } = await supabase
      .from('skills')
      .select('*')
      .limit(1);

    if (skillsError) {
      throw new Error(`Skills query failed: ${skillsError.message}`);
    }
    console.log('✓ Database connection successful');
    console.log(`✓ Found ${skills?.length || 0} skill(s)`);

    return {
      success: true,
      message: 'Supabase connection test passed',
    };
  } catch (error) {
    console.error('✗ Supabase connection test failed:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
