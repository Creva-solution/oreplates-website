// Supabase Configuration
// Replace these with your actual Supabase URL and Anon Key
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

if (typeof supabase === 'undefined') {
    // This will be loaded from CDN in the HTML files
}

const supabaseClient = typeof supabase !== 'undefined' ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

export { supabaseClient };
