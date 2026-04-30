const SUPABASE_URL = 'https://sforgndgcxkbbzstbehu.supabase.co';
const SUPABASE_KEY = 'sb_publishable_QHZWgDbGu-7PVGgHRKJn3A_AqY2UvB-';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// deixa global
window.supabaseClient = supabase;