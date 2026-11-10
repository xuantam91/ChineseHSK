// ==============================================================================
// Chinese Learning Journey — Server Supabase Client
// File: src/lib/supabase/server.ts
// Description: Server-side Supabase client using @supabase/ssr and Next.js cookies.
// ==============================================================================

import { createServerClient as createSSRServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types/database';
import { createMockSupabaseClient } from './mock-adapter';

export async function createClient() {
  const isMock =
    process.env.USE_MOCK_SUPABASE === 'true' ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project');

  if (isMock) {
    return createMockSupabaseClient();
  }

  const cookieStore = await cookies();

  return createSSRServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // Can be ignored if middleware is refreshing sessions.
          }
        },
      },
    }
  );
}

export const getSupabaseServerClient = createClient;
