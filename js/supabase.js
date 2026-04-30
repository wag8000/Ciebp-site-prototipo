import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient(
  'https://sforgndgcxkbbzstbehu.supabase.co',
  'sb_publishable_QHZWgDbGu-7PVGgHRKJn3A_AqY2UvB-'
)

export default supabase