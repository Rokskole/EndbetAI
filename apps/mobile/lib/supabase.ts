import { createClient } from '@supabase/supabase-js';
import { config } from '@packages/config';

// Create Supabase client for mobile app
export const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
