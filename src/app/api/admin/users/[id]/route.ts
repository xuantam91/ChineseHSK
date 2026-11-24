import { NextRequest } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  isUsingRealSupabase,
  jsonError,
  jsonSuccess,
  requireSuperAdmin,
  SUPER_ADMIN_EMAIL,
} from '@/lib/auth';

const UpdateUserRoleSchema = z.object({
  role: z.enum(['student', 'guardian', 'admin', 'super_admin']).optional(),
  display_name: z.string().trim().min(1).max(120).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const actor = await requireSuperAdmin(req);
    const { id: targetId } = await params;

    const body = await req.json();
    const parsed = UpdateUserRoleSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(400, 'BAD_REQUEST', 'Dữ liệu cập nhật vai trò không hợp lệ.', parsed.error.flatten());
    }

    const { role: nextRole, display_name: nextDisplayName } = parsed.data;
    if (!nextRole && !nextDisplayName) {
      return jsonError(400, 'BAD_REQUEST', 'Cần cung cấp role hoặc display_name để cập nhật.');
    }

    if (isUsingRealSupabase()) {
      const adminClient = createAdminClient();
      const { data: userRes, error: getUserErr } = await adminClient.auth.admin.getUserById(targetId);
      if (getUserErr || !userRes?.user) {
        return jsonError(404, 'NOT_FOUND', 'Không tìm thấy tài khoản trên hệ thống.');
      }

      const targetEmail = (userRes.user.email || '').toLowerCase();
      if (targetEmail === SUPER_ADMIN_EMAIL && nextRole && nextRole !== 'super_admin') {
        return jsonError(400, 'PROTECTED_ACCOUNT', 'Không thể hạ quyền tài khoản Super Admin gốc (xuantam91@gmail.com).');
      }
      if (targetId === actor.id && nextRole && nextRole !== 'super_admin') {
        return jsonError(400, 'SELF_DEMOTION_FORBIDDEN', 'Bạn không thể tự hạ quyền Super Admin của chính mình.');
      }

      const { data: existingProfile } = await adminClient
        .from('profiles')
        .select('*')
        .eq('id', targetId)
        .maybeSingle();

      const updatedPayload = {
        id: targetId,
        email: targetEmail || existingProfile?.email || null,
        display_name:
          nextDisplayName ||
          existingProfile?.display_name ||
          (userRes.user.user_metadata?.display_name as string) ||
          targetEmail.split('@')[0] ||
          'Người dùng',
        age_group: existingProfile?.age_group || 'adult',
        timezone: existingProfile?.timezone || 'Asia/Ho_Chi_Minh',
        role: nextRole || existingProfile?.role || 'student',
        updated_at: new Date().toISOString(),
      };

      const { data: savedProfile, error: upsertErr } = await adminClient
        .from('profiles')
        .upsert(updatedPayload)
        .select('*')
        .single();

      if (upsertErr) {
        return jsonError(500, 'UPDATE_FAILED', upsertErr.message);
      }

      if (nextRole) {
        await adminClient.auth.admin.updateUserById(targetId, {
          app_metadata: {
            ...(userRes.user.app_metadata || {}),
            role: nextRole,
          },
        });
      }

      await adminClient.from('audit_logs').insert({
        actor_user_id: actor.id,
        action: 'UPDATE_USER_ROLE',
        entity_type: 'profile',
        entity_id: targetId,
        summary_jsonb: {
          target_email: targetEmail,
          previous_role: existingProfile?.role || null,
          new_role: savedProfile.role,
        },
      });

      return jsonSuccess(savedProfile);
    }

    // Mock / Local mode
    const existing = await db.getProfile(targetId);
    if (!existing) {
      return jsonError(404, 'NOT_FOUND', 'Không tìm thấy tài khoản.');
    }

    const targetEmail = (existing.email || '').toLowerCase();
    if (targetEmail === SUPER_ADMIN_EMAIL && nextRole && nextRole !== 'super_admin') {
      return jsonError(400, 'PROTECTED_ACCOUNT', 'Không thể hạ quyền tài khoản Super Admin gốc (xuantam91@gmail.com).');
    }
    if (targetId === actor.id && nextRole && nextRole !== 'super_admin') {
      return jsonError(400, 'SELF_DEMOTION_FORBIDDEN', 'Bạn không thể tự hạ quyền Super Admin của chính mình.');
    }

    const updated = await db.upsertProfile({
      ...existing,
      display_name: nextDisplayName || existing.display_name,
      role: nextRole || existing.role,
      updated_at: new Date().toISOString(),
    });

    await db.createAuditLog({
      actor_user_id: actor.id,
      action: 'UPDATE_USER_ROLE',
      entity_type: 'profile',
      entity_id: targetId,
      summary_jsonb: {
        previous_role: existing.role,
        new_role: updated.role,
      },
    });

    return jsonSuccess(updated);
  } catch (err: any) {
    if (err.name === 'AuthError') {
      return jsonError(err.statusCode, err.code, err.message);
    }
    return jsonError(500, 'INTERNAL_SERVER_ERROR', err.message || 'Không thể cập nhật vai trò người dùng.');
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const actor = await requireSuperAdmin(req);
    const { id: targetId } = await params;

    if (targetId === actor.id) {
      return jsonError(400, 'SELF_DELETE_FORBIDDEN', 'Bạn không thể tự xóa tài khoản Super Admin đang đăng nhập.');
    }

    if (isUsingRealSupabase()) {
      const adminClient = createAdminClient();
      const { data: userRes, error: getUserErr } = await adminClient.auth.admin.getUserById(targetId);
      if (getUserErr || !userRes?.user) {
        return jsonError(404, 'NOT_FOUND', 'Không tìm thấy tài khoản cần xóa.');
      }

      const targetEmail = (userRes.user.email || '').toLowerCase();
      if (targetEmail === SUPER_ADMIN_EMAIL) {
        return jsonError(400, 'PROTECTED_ACCOUNT', 'Không thể xóa tài khoản Super Admin gốc (xuantam91@gmail.com).');
      }

      const { error: deleteErr } = await adminClient.auth.admin.deleteUser(targetId);
      if (deleteErr) {
        return jsonError(500, 'DELETE_FAILED', deleteErr.message);
      }

      await adminClient.from('audit_logs').insert({
        actor_user_id: actor.id,
        action: 'DELETE_USER',
        entity_type: 'profile',
        entity_id: targetId,
        summary_jsonb: { deleted_email: targetEmail },
      });

      return jsonSuccess({ deleted: true, id: targetId });
    }

    // Mock / Local mode
    const existing = await db.getProfile(targetId);
    if (!existing) {
      return jsonError(404, 'NOT_FOUND', 'Không tìm thấy tài khoản cần xóa.');
    }
    if ((existing.email || '').toLowerCase() === SUPER_ADMIN_EMAIL) {
      return jsonError(400, 'PROTECTED_ACCOUNT', 'Không thể xóa tài khoản Super Admin gốc (xuantam91@gmail.com).');
    }

    await db.deleteProfile(targetId);
    await db.createAuditLog({
      actor_user_id: actor.id,
      action: 'DELETE_USER',
      entity_type: 'profile',
      entity_id: targetId,
      summary_jsonb: { deleted_email: existing.email || targetId },
    });

    return jsonSuccess({ deleted: true, id: targetId });
  } catch (err: any) {
    if (err.name === 'AuthError') {
      return jsonError(err.statusCode, err.code, err.message);
    }
    return jsonError(500, 'INTERNAL_SERVER_ERROR', err.message || 'Không thể xóa tài khoản.');
  }
}
