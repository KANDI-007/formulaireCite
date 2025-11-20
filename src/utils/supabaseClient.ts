import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Log pour débogage (uniquement en développement)
if (import.meta.env.DEV) {
  console.log('🔍 Supabase Configuration Check:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    urlLength: supabaseUrl?.length || 0,
    keyLength: supabaseAnonKey?.length || 0,
    isConfigured: isSupabaseConfigured,
  });
}

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : null;

if (!isSupabaseConfigured) {
  console.error(
    '❌ Supabase credentials are missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.'
  );
  console.error('Current env values:', {
    VITE_SUPABASE_URL: supabaseUrl || 'NOT SET',
    VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? '***SET***' : 'NOT SET',
  });
}

