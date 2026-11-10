// ==============================================================================
// Chinese Learning Journey — Browser Supabase Client
// File: src/lib/supabase/client.ts
// Description: Client-side Supabase instance using @supabase/ssr.
//              Gracefully falls back to mock adapter when credentials are absent
//              or USE_MOCK_SUPABASE=true.
// ==============================================================================

import { createBrowserClient as createSSRBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database';
import { createMockSupabaseClient } from './mock-adapter';

let browserClient: any = null;

export function createClient() {
  const isMock =
    process.env.NEXT_PUBLIC_USE_MOCK_SUPABASE === 'true' ||
    process.env.USE_MOCK_SUPABASE === 'true' ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project');

  if (isMock) {
    return createMockSupabaseClient();
  }

  if (browserClient) return browserClient;

  browserClient = createSSRBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return browserClient;
}

export const getSupabaseBrowserClient = createClient;
