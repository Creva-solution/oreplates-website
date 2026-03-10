// Supabase Configuration
const SUPABASE_URL = 'https://hvtaalwvjshpjxvgbdrb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2dGFhbHd2anNocGp4dmdiZHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNjE1NzAsImV4cCI6MjA4ODYzNzU3MH0.FsyQUJp6AUpy2ZnSuSc_o_lmK86M23CjgAqHacWv-UE';

// Initialize the Supabase client
// We use window.supabase (the library from CDN)
const supabaseInstance = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
window.supabaseInstance = supabaseInstance;
