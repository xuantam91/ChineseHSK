import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createClient as createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { Profile, UserRole } from '@/types/database';

export const SUPER_ADMIN_EMAIL = 'xuantam91@gmail.com';
export const LOCAL_SESSION_COOKIE = 'clj_local_user_id';

export class AuthError extends Error {
  statusCode: number;
  code: string;
  details?: any;

  constructor(statusCode: number, code: string, message: string, details?: any) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export function isAdminRole(role?: string | null): boolean {
  return role === 'admin' || role === 'super_admin';
}

export function isSuperAdminRole(role?: string | null): boolean {
  return role === 'super_admin';
}

export function isUsingRealSupabase(): boolean {
  if (process.env.NODE_ENV === 'test') return false;
  if (process.env.USE_MOCK_SUPABASE === 'true') return false;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return Boolean(
    url &&
      !url.includes('your-project') &&
      serviceKey &&
      !serviceKey.includes('your-service-role')
  );
}

/**
 * Standard JSON Success responder
 */
export function jsonSuccess<T>(data: T, status: number = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

/**
 * Standard JSON Error responder
 */
export function jsonError(statusCode: number, code: string, message: string, details?: any) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        details,
      },
    },
    { status: statusCode }
  );
}

/**
 * Extracts and verifies the current authenticated user session.
 * Uses real Supabase Auth in production; supports mock/test sessions locally.
 */
export async function getAuthenticatedUser(req?: NextRequest): Promise<Profile | null> {
  // 1. Production Supabase Auth verification (strict cookie/JWT check, no spoofable headers)
  if (isUsingRealSupabase()) {
    try {
      const supabase = await createServerSupabaseClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        return null;
      }

      const normalizedEmail = user.email?.trim().toLowerCase() || null;
      const expectedSuperAdmin = normalizedEmail === SUPER_ADMIN_EMAIL;
      const adminClient = createAdminClient();

      const { data: existingProfile } = await adminClient
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (existingProfile) {
        if (expectedSuperAdmin && existingProfile.role !== 'super_admin') {
          const { data: promoted } = await adminClient
            .from('profiles')
            .update({ role: 'super_admin', email: normalizedEmail })
            .eq('id', user.id)
            .select('*')
            .single();
          return (promoted as Profile) || { ...existingProfile, role: 'super_admin' };
        }
        return {
          ...(existingProfile as Profile),
          email: existingProfile.email || normalizedEmail,
        };
      }

      const fallbackRole: UserRole = expectedSuperAdmin ? 'super_admin' : 'student';
      const userMetadata = (user.user_metadata || {}) as Record<string, any>;
      const displayName =
        (userMetadata.display_name as string) ||
        (userMetadata.full_name as string) ||
        normalizedEmail?.split('@')[0] ||
        'Học viên';

      const { data: createdProfile } = await adminClient
        .from('profiles')
        .upsert({
          id: user.id,
          email: normalizedEmail,
          display_name: displayName,
          age_group: 'adult',
          timezone: 'Asia/Ho_Chi_Minh',
          role: fallbackRole,
        })
        .select('*')
        .single();

      return (
        (createdProfile as Profile) || {
          id: user.id,
          email: normalizedEmail,
          display_name: displayName,
          age_group: 'adult',
          timezone: 'Asia/Ho_Chi_Minh',
          role: fallbackRole,
        }
      );
    } catch {
      return null;
    }
  }

  // 2. Local/Test mock mode: check explicit local session cookie or test header
  const localSessionUserId = req?.cookies.get(LOCAL_SESSION_COOKIE)?.value;
  if (localSessionUserId) {
    const profile = await db.getProfile(localSessionUserId);
    if (profile) return profile;
  }

  const headerUserId = req?.headers.get('x-user-id');
  if (headerUserId) {
    const profile = await db.getProfile(headerUserId);
    if (profile) return profile;
  }

  // 3. Automated test / dev route helper on /api/admin
  const isAdminPath = req?.nextUrl.pathname.startsWith('/api/admin');
  if (isAdminPath) {
    const requestedRole = req?.headers.get('x-role');
    if (requestedRole === 'student') {
      return (await db.getProfile('usr-student-01')) || null;
    }
    return (await db.getProfile('usr-superadmin-01')) || (await db.getProfile('usr-admin-01')) || null;
  }

  // 4. Fallback to default active student user for dev/mock API routes
  const student = await db.getProfile('usr-student-01');
  return student || null;
}

/**
 * Ensures user is authenticated. Throws 401 if not.
 */
export async function requireUser(req?: NextRequest): Promise<Profile> {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    throw new AuthError(401, 'UNAUTHORIZED', 'Vui lòng đăng nhập để tiếp tục.');
  }
  return user;
}

/**
 * Ensures user has admin or super_admin role. Throws 403 if not.
 */
export async function requireAdmin(req?: NextRequest): Promise<Profile> {
  const user = await requireUser(req);
  if (!isAdminRole(user.role)) {
    throw new AuthError(
      403,
      'FORBIDDEN',
      'Bạn không có quyền quản trị viên (Admin / Super Admin) để thực hiện thao tác này.'
    );
  }
  return user;
}

/**
 * Ensures user has super_admin role. Throws 403 if not.
 */
export async function requireSuperAdmin(req?: NextRequest): Promise<Profile> {
  const user = await requireUser(req);
  if (!isSuperAdminRole(user.role)) {
    throw new AuthError(
      403,
      'FORBIDDEN',
      'Chỉ Super Admin mới có quyền quản lý phân quyền và xóa tài khoản.'
    );
  }
  return user;
}
