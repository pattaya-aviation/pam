/**
 * Supabase Configuration
 * Shared client for all PA System pages
 */

const SUPABASE_URL = 'https://hptcjcoowhmgtamqqgnr.supabase.co';
// ✅ Valid JWT anon key — project: hptcjcoowhmgtamqqgnr (Legacy anon key from Supabase Dashboard)
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwdGNqY29vd2htZ3RhbXFxZ25yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMjQ0OTcsImV4cCI6MjA4NjgwMDQ5N30.SvLPWPBPXKEvg3VpgJtBWFhQMmcanF865kWoPTGlmqU';

// Fix #7: Show visible error banner if Supabase fails — rather than silent console.error
function _showSupabaseError(msg) {
    const banner = document.createElement('div');
    banner.style.cssText = [
        'position:fixed', 'top:0', 'left:0', 'right:0', 'z-index:9999',
        'background:#ef4444', 'color:#fff', 'padding:10px 20px',
        'font-family:sans-serif', 'font-size:13px', 'text-align:center',
        'display:flex', 'align-items:center', 'justify-content:center', 'gap:8px'
    ].join(';');
    banner.innerHTML = '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>'
        + '<span>ไม่สามารถเชื่อมต่อฐานข้อมูลได้: ' + msg + '</span>';
    document.addEventListener('DOMContentLoaded', () => document.body.prepend(banner));
}

// Guard: validate key looks like a JWT (3 parts separated by '.')
if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY.split('.').length !== 3) {
    console.error('❌ SUPABASE_ANON_KEY ไม่ใช่ JWT ที่ถูกต้อง');
    _showSupabaseError('ANON_KEY ไม่ถูกต้อง');
    window.supabaseClient = null;
} else {
    // Initialize Supabase client
    // Use window.supabaseClient to avoid conflict with window.supabase (the library)
    try {
        const { createClient } = window.supabase;
        window.supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase client initialized for project: hptcjcoowhmgtamqqgnr');
    } catch (e) {
        console.error('❌ Supabase init error:', e);
        _showSupabaseError(e.message || 'init failed');
        window.supabaseClient = null;
    }
}

