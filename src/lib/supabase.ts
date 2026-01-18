import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// This function creates a new PUBLIC client for each request.
// This is for client-side and public server-side data fetching.
export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_URL' || !supabaseKey || supabaseKey === 'YOUR_SUPABASE_ANON_KEY') {
    // This allows the app to build but will fail on data access.
    // A warning is logged in the server console.
    console.warn('Public Supabase credentials are not configured. The application will not be able to fetch public data.');
    return null;
  }

  return createSupabaseClient(supabaseUrl, supabaseKey);
};
