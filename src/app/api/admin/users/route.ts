import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  isSuperAdminRole,
  isUsingRealSupabase,
  jsonError,
  jsonSuccess,
  requireAdmin,
  SUPER_ADMIN_EMAIL,
} from '@/lib/auth';

export interface AdminUserAccountDTO {
  id: string;
  email: string;
  display_name: string;
  role: 'student' | 'admin' | 'super_admin' | 'guardian';
  age_group: string;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed: boolean;
  enrollment_status: string;
  completed_lessons: number;
  is_protected: boolean;
}

export async function GET(req: NextRequest) {
  try {
    const actor = await requireAdmin(req);

    if (isUsingRealSupabase()) {
      const adminClient = createAdminClient();

      const [{ data: authData, error: authErr }, { data: profilesData }, { data: enrollmentsData }, { data: progressData }] =
        await Promise.all([
          adminClient.auth.admin.listUsers({ page: 1, perPage: 200 }),
          adminClient.from('profiles').select('*'),
          adminClient.from('enrollments').select('id, user_id, status'),
          adminClient.from('lesson_progress').select('enrollment_id, status'),
        ]);

      if (authErr) {
        return jsonError(500, 'SUPABASE_ADMIN_ERROR', authErr.message);
      }

      const profilesMap = new Map((profilesData || []).map((p: any) => [p.id, p]));
      const enrollmentByUser = new Map<string, { id: string; status: string }>();
      for (const e of enrollmentsData || []) {
        enrollmentByUser.set(e.user_id, { id: e.id, status: e.status });
      }

      const completedByEnrollment = new Map<string, number>();
      for (const lp of progressData || []) {
        if (lp.status === 'completed') {
          completedByEnrollment.set(lp.enrollment_id, (completedByEnrollment.get(lp.enrollment_id) || 0) + 1);
        }
      }

      const accounts: AdminUserAccountDTO[] = (authData?.users || []).map((u) => {
        const profile: any = profilesMap.get(u.id);
        const email = (u.email || profile?.email || '').toLowerCase();
        const isRootSuperAdmin = email === SUPER_ADMIN_EMAIL;
        const resolvedRole = isRootSuperAdmin
          ? 'super_admin'
          : (profile?.role as AdminUserAccountDTO['role']) || 'student';
        const enrollment = enrollmentByUser.get(u.id);

        return {
          id: u.id,
          email: u.email || profile?.email || '(chưa có email)',
          display_name:
            profile?.display_name ||
            (u.user_metadata?.display_name as string) ||
            (u.email ? u.email.split('@')[0] : 'Người dùng'),
          role: resolvedRole,
          age_group: profile?.age_group || 'adult',
          created_at: profile?.created_at || u.created_at,
          last_sign_in_at: u.last_sign_in_at || null,
          email_confirmed: Boolean(u.email_confirmed_at),
          enrollment_status: enrollment?.status || 'none',
          completed_lessons: enrollment ? completedByEnrollment.get(enrollment.id) || 0 : 0,
          is_protected: isRootSuperAdmin || u.id === actor.id,
        };
      });

      accounts.sort((a, b) => {
        const rank = { super_admin: 0, admin: 1, guardian: 2, student: 3 };
        return (rank[a.role] ?? 9) - (rank[b.role] ?? 9);
      });

      return jsonSuccess({
        users: accounts,
        actor: {
          id: actor.id,
          email: actor.email || null,
          role: actor.role,
          can_manage_roles: isSuperAdminRole(actor.role),
        },
      });
    }

    // Local / Mock mode
    const profiles = await db.getAllProfiles();
    const enrollments = await db.getAllEnrollments();
    const accounts: AdminUserAccountDTO[] = await Promise.all(
      profiles.map(async (p) => {
        const enrollment = enrollments.find((e) => e.user_id === p.id);
        let completedLessons = 0;
        if (enrollment) {
          const overview = await db.getTodayOverview(enrollment);
          completedLessons = overview.stats.completed_lessons;
        }
        const email = (p.email || `${p.id}@local.dev`).toLowerCase();
        const isRootSuperAdmin = email === SUPER_ADMIN_EMAIL;
        return {
          id: p.id,
          email: p.email || `${p.id}@local.dev`,
          display_name: p.display_name,
          role: isRootSuperAdmin ? 'super_admin' : (p.role as AdminUserAccountDTO['role']),
          age_group: p.age_group,
          created_at: p.created_at || new Date().toISOString(),
          last_sign_in_at: p.updated_at || null,
          email_confirmed: true,
          enrollment_status: enrollment?.status || 'none',
          completed_lessons: completedLessons,
          is_protected: isRootSuperAdmin || p.id === actor.id,
        };
      })
    );

    accounts.sort((a, b) => {
      const rank = { super_admin: 0, admin: 1, guardian: 2, student: 3 };
      return (rank[a.role] ?? 9) - (rank[b.role] ?? 9);
    });

    return jsonSuccess({
      users: accounts,
      actor: {
        id: actor.id,
        email: actor.email || null,
        role: actor.role,
        can_manage_roles: isSuperAdminRole(actor.role),
      },
    });
  } catch (err: any) {
    if (err.name === 'AuthError') {
      return jsonError(err.statusCode, err.code, err.message);
    }
    return jsonError(500, 'INTERNAL_SERVER_ERROR', err.message || 'Lỗi khi tải danh sách tài khoản.');
  }
}
