import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import {
  getAuthenticatedUser,
  isSuperAdminRole,
  isUsingRealSupabase,
  jsonError,
  jsonSuccess,
  LOCAL_SESSION_COOKIE,
  SUPER_ADMIN_EMAIL,
} from '@/lib/auth';
import { UserRole } from '@/types/database';

const LocalSessionSchema = z.object({
  email: z.string().email(),
  display_name: z.string().trim().min(1).max(120).optional(),
  age_group: z.enum(['adult', 'teen', 'kid', 'all', 'adults', 'teens', 'kids']).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const isReal = isUsingRealSupabase();
    const user = await getAuthenticatedUser(req);

    if (!user) {
      return jsonSuccess({
        authenticated: false,
        mode: isReal ? 'supabase' : 'mock',
        user: null,
      });
    }

    return jsonSuccess({
      authenticated: true,
      mode: isReal ? 'supabase' : 'mock',
      user: {
        id: user.id,
        email: user.email || null,
        display_name: user.display_name,
        role: user.role,
        is_super_admin: isSuperAdminRole(user.role),
      },
    });
  } catch (err: any) {
    return jsonError(500, 'INTERNAL_SERVER_ERROR', err.message || 'Lỗi xác thực phiên.');
  }
}

/**
 * Syncs local session cookie ONLY when running in offline/mock mode (no Supabase credentials).
 */
export async function POST(req: NextRequest) {
  if (isUsingRealSupabase()) {
    return jsonError(403, 'FORBIDDEN', 'Phiên cục bộ không khả dụng khi kết nối Supabase Production.');
  }

  try {
    const body = await req.json();
    const parsed = LocalSessionSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(400, 'BAD_REQUEST', 'Thông tin tài khoản không hợp lệ.');
    }

    const email = parsed.data.email.trim().toLowerCase();
    const existing = (await db.getAllProfiles()).find(
      (p) => (p.email || '').toLowerCase() === email
    );

    let profile = existing;
    if (!profile) {
      const assignedRole: UserRole = email === SUPER_ADMIN_EMAIL ? 'super_admin' : 'student';
      profile = await db.upsertProfile({
        id: email === SUPER_ADMIN_EMAIL ? 'usr-superadmin-01' : `usr-local-${Date.now()}`,
        email,
        display_name:
          parsed.data.display_name ||
          (email === SUPER_ADMIN_EMAIL ? 'Xuân Tâm (Super Admin)' : email.split('@')[0]),
        age_group: (parsed.data.age_group as any) || 'adults',
        timezone: 'Asia/Ho_Chi_Minh',
        role: assignedRole,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    } else if (email === SUPER_ADMIN_EMAIL && profile.role !== 'super_admin') {
      profile = await db.upsertProfile({
        ...profile,
        role: 'super_admin',
        updated_at: new Date().toISOString(),
      });
    }

    const res = NextResponse.json({
      success: true,
      data: {
        authenticated: true,
        mode: 'mock',
        user: {
          id: profile.id,
          email: profile.email || email,
          display_name: profile.display_name,
          role: profile.role,
          is_super_admin: isSuperAdminRole(profile.role),
        },
      },
    });

    res.cookies.set(LOCAL_SESSION_COOKIE, profile.id, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  } catch (err: any) {
    return jsonError(500, 'INTERNAL_SERVER_ERROR', err.message || 'Không thể khởi tạo phiên.');
  }
}

export async function DELETE() {
  if (isUsingRealSupabase()) {
    try {
      const { createClient } = await import('@/lib/supabase/server');
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch {
      // ignore signOut failure and clear local cookie
    }
  }
  const res = NextResponse.json({ success: true, data: { signed_out: true } });
  res.cookies.delete(LOCAL_SESSION_COOKIE);
  return res;
}
