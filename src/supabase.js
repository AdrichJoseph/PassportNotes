import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase env vars. Did you create a .env file with REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY?'
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;