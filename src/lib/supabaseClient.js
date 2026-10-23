import { createClient } from '@supabase/supabase-js';

// Get config from environment variables or localStorage
export const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const localUrl = localStorage.getItem('tw_supabase_url');
  const localKey = localStorage.getItem('tw_supabase_anon_key');

  const url = (localUrl && localUrl.trim()) || (envUrl && envUrl.trim()) || '';
  const key = (localKey && localKey.trim()) || (envKey && envKey.trim()) || '';

  return { url, key };
};

// Check if credentials are provided
export const isSupabaseConfigured = () => {
  const { url, key } = getSupabaseConfig();
  return Boolean(url && key && url.startsWith('http'));
};

// Save config to localStorage
export const saveSupabaseConfig = (url, key) => {
  if (url) localStorage.setItem('tw_supabase_url', url.trim());
  if (key) localStorage.setItem('tw_supabase_anon_key', key.trim());
  reinitSupabaseClient();
};

// Clear config
export const clearSupabaseConfig = () => {
  localStorage.removeItem('tw_supabase_url');
  localStorage.removeItem('tw_supabase_anon_key');
  reinitSupabaseClient();
};

let supabaseInstance = null;

export const getSupabaseClient = () => {
  const { url, key } = getSupabaseConfig();
  if (url && key && url.startsWith('http')) {
    if (!supabaseInstance) {
      supabaseInstance = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        },
        realtime: {
          params: {
            eventsPerSecond: 10
          }
        }
      });
    }
    return supabaseInstance;
  }
  return null;
};

export const reinitSupabaseClient = () => {
  supabaseInstance = null;
  return getSupabaseClient();
};

// Test connection
export const testSupabaseConnection = async (customUrl, customKey) => {
  try {
    const url = customUrl || getSupabaseConfig().url;
    const key = customKey || getSupabaseConfig().key;
    if (!url || !key) return { success: false, message: 'Chưa nhập URL hoặc Anon Key' };

    const tempClient = createClient(url, key);
    // Simple ping to check if Supabase project responds
    const { error } = await tempClient.from('profiles').select('id').limit(1);
    
    // Even if profiles table is not yet created, code PGRST204/PGRST205 or 42P01 means connection itself succeeded
    if (error && error.code !== '42P01' && error.code !== 'PGRST204' && !error.message?.includes('does not exist')) {
      return { success: false, message: `Lỗi kết nối: ${error.message}` };
    }

    return { 
      success: true, 
      message: 'Kết nối thành công đến Supabase!',
      tableExists: !error || !error.message?.includes('does not exist')
    };
  } catch (err) {
    return { success: false, message: `Lỗi: ${err.message || 'Không thể kết nối'}` };
  }
};

export const supabase = getSupabaseClient();

