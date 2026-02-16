/**
 * Supabase Configuration
 * Shared client for all PA System pages
 */

const SUPABASE_URL = 'https://hptcjcoowhmgtamqqgnr.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_50ie_JD0SyYV37piwLW1YA_j6D_8Rqb';

// Initialize Supabase client
// Use window.supabaseClient to avoid conflict with window.supabase (the library)
try {
    const { createClient } = window.supabase;
    window.supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase client initialized successfully');
} catch (e) {
    console.error('❌ Supabase init error:', e);
    window.supabaseClient = null;
}
