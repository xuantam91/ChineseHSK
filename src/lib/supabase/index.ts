// ==============================================================================
// Chinese Learning Journey — Supabase Module Exports
// File: src/lib/supabase/index.ts
// ==============================================================================

export { createClient as createBrowserClient, getSupabaseBrowserClient } from './client';
export { createClient as createServerClient, getSupabaseServerClient } from './server';
export { createAdminClient, getSupabaseAdminClient } from './admin';
export {
  MockSupabaseClient,
  MockQueryBuilder,
  mockState,
  createMockSupabaseClient,
  createMockSupabaseAdminClient,
} from './mock-adapter';
