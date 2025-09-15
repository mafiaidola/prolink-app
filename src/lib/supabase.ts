import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// This function is memoized, so it will only create a single client instance.
let supabaseClient: ReturnType<typeof createSupabaseClient> | null = null;

export const createClient = () => {
  // If the client is already created, return it.
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Check if the URL and Key are placeholders or missing.
  if (!supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_URL' || !supabaseKey || supabaseKey === 'YOUR_SUPABASE_ANON_KEY') {
    // Log a warning in the server console instead of throwing an error.
    // This allows the app to build and run in a degraded state.
    console.warn('Supabase credentials are not configured. The application will run in a limited mode. Please update your .env file.');
    return null;
  }

  // Create and memoize the client.
  supabaseClient = createSupabaseClient(supabaseUrl, supabaseKey);
  return supabaseClient;
};
