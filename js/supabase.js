// ==========================================
// SUPABASE CLIENT BOOTSTRAP (non-module safe)
// Ensures a single global `window.supabaseClient` for the app.
// Configure your project URL and anon key below.
// ==========================================

/* NOTE
 - This file is intentionally a non-module script because pages include it
   with a plain <script src="./js/supabase.js"></script> tag.
 - Many other app scripts expect `window.supabaseClient` to exist, so
   we create that global here if possible.
*/

;(function () {
  if (typeof window === 'undefined') return;

  if (window.supabaseClient) return; // already initialized

  const SUPABASE_URL = 'https://sforgndgcxkbbzstbehu.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_QHZWgDbGu-7PVGgHRKJn3A_AqY2UvB-';

  if (typeof supabase === 'undefined') {
    // CDN not loaded — warn but keep page usable for offline/local fallback
    console.warn('Supabase CDN not loaded; realtime and db will not function.');
    return;
  }

  try {
    window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false },
    });
  } catch (e) {
    console.error('Erro ao inicializar Supabase client', e);
  }
})();
