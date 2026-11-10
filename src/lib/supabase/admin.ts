// ==============================================================================
// Chinese Learning Journey — Admin / Service Role Supabase Client
// File: src/lib/supabase/admin.ts
// Description: Server-only Supabase client initialized with the Service Role key.
//              Bypasses Row-Level Security for trusted backend operations,
//              migrations, seeding, and admin APIs.
//              SECURITY: NEVER expose SUPABASE_SERVICE_ROLE_KEY to client bundles!
// ==============================================================================

import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { createMockSupabaseAdminClient } from './mock-adapter';

let adminClient: SupabaseClient<Database> | null = null;

export function createAdminClient(): SupabaseClient<Database> {
  const isMock =
    process.env.USE_MOCK_SUPABASE === 'true' ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY.includes('your-service-role') ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project');

  if (isMock) {
    return createMockSupabaseAdminClient() as unknown as SupabaseClient<Database>;
  }

  if (adminClient) return adminClient;

  adminClient = createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );

  return adminClient;
}

export const getSupabaseAdminClient = createAdminClient;
