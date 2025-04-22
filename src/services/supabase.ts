import { Env } from '@/lib/env';
import storage from '@/lib/storage';
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(Env.SUPABASE_URL, Env.SUPABASE_ANON_KEY, {
  auth: {
    storage: storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
