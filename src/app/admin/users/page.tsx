'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Users,
  ShieldCheck,
  Crown,
  Search,
  Trash2,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  BookCheck,
} from 'lucide-react';

type AccountRole = 'student' | 'guardian' | 'admin' | 'super_admin';

interface AdminUserAccount {
  id: string;
  email: string;
  display_name: string;
  role: AccountRole;
  age_group: string;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed: boolean;
  enrollment_status: string;
  completed_lessons: number;
  is_protected: boolean;
}

interface ActorInfo {
  id: string;
  email: string | null;
  role: AccountRole;
  can_manage_roles: boolean;
}

const ROLE_LABELS: Record<AccountRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  guardian: 'Phụ huynh',
  student: 'Học viên',
};

const ROLE_BADGE_CLASSES: Record<AccountRole, string> = {
  super_admin: 'bg-amber-100 text-amber-900 border-amber-300',
  admin: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  guardian: 'bg-sky-100 text-sky-800 border-sky-200',
  student: 'bg-emerald-100 text-emerald-800 border-emerald-200',
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserAccount[]>([]);
  const [actor, setActor] = useState<ActorInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | AccountRole>('all');
  const [pendingRoles, setPendingRoles] = useState<Record<string, AccountRole>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/users');
      const json = await res.json();
      if (json.success && json.data) {
        const list: AdminUserAccount[] = json.data.users || [];
        setUsers(list);
        setActor(json.data.actor || null);
        const initialDrafts: Record<string, AccountRole> = {};
        for (const u of list) {
          initialDrafts[u.id] = u.role;
        }
        setPendingRoles(initialDrafts);
      } else {
        setBanner({
          type: 'error',
          text: json?.error?.message || 'Không thể tải danh sách tài khoản.',
        });
      }
    } catch {
      setBanner({
        type: 'error',
        text: 'Lỗi kết nối khi tải danh sách tài khoản.',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return users.filter((u) => {
      if (roleFilter !== 'all' && u.role !== roleFilter) return false;
      if (!q) return true;
      return (
        u.email.toLowerCase().includes(q) ||
        u.display_name.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q)
      );
    });
  }, [users, searchQuery, roleFilter]);

  const stats = useMemo(() => {
    return {
      total: users.length,
      admins: users.filter((u) => u.role === 'super_admin' || u.role === 'admin').length,
      students: users.filter((u) => u.role === 'student').length,
    };
  }, [users]);

  const handleSaveRole = async (user: AdminUserAccount) => {
    const nextRole = pendingRoles[user.id] || user.role;
    if (nextRole === user.role) return;

    setBanner(null);
    setSavingId(user.id);
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(user.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: nextRole }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setBanner({
          type: 'error',
          text: json?.error?.message || 'Không thể cập nhật vai trò.',
        });
        return;
      }

      setUsers((prev) =>
        prev.map((item) => (item.id === user.id ? { ...item, role: nextRole } : item))
      );
      setBanner({
        type: 'success',
        text: `Đã cập nhật vai trò của ${user.email} thành ${ROLE_LABELS[nextRole]}.`,
      });
    } catch {
      setBanner({ type: 'error', text: 'Lỗi mạng khi cập nhật vai trò.' });
    } finally {
      setSavingId(null);
    }
  };

  const handleDeleteUser = async (user: AdminUserAccount) => {
    setBanner(null);
    setDeletingId(user.id);
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(user.id)}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setBanner({
          type: 'error',
          text: json?.error?.message || 'Không thể xóa tài khoản.',
        });
        return;
      }

      setUsers((prev) => prev.filter((item) => item.id !== user.id));
      setConfirmDeleteId(null);
      setBanner({
        type: 'success',
        text: `Đã xóa tài khoản ${user.email} khỏi hệ thống.`,
      });
    } catch {
      setBanner({ type: 'error', text: 'Lỗi mạng khi xóa tài khoản.' });
    } finally {
      setDeletingId(null);
    }
  };

  const canManage = Boolean(actor?.can_manage_roles);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center">
            <Users className="w-6 h-6 mr-2 text-emerald-600" />
            Quản Lý Tài Khoản & Phân Quyền Hệ Thống
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Xem danh sách tài khoản, phân quyền (Student / Guardian / Admin / Super Admin) và xóa tài khoản
          </p>
        </div>
        <div className="flex items-center gap-2">
          {canManage ? (
            <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200">
              <Crown className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
              Super Admin: Toàn quyền sửa Role & Xóa
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
              Chế độ chỉ xem (Cần Super Admin để sửa)
            </span>
          )}
          <button
            type="button"
            onClick={fetchUsers}
            disabled={loading}
            className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {banner && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center justify-between gap-3 ${
            banner.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {banner.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span className="font-medium">{banner.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setBanner(null)}
            className="text-[11px] font-bold opacity-70 hover:opacity-100 cursor-pointer"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase text-slate-500">Tổng tài khoản</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{stats.total}</div>
          </div>
          <Users className="w-8 h-8 text-slate-300" />
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase text-slate-500">Quản trị viên</div>
            <div className="text-2xl font-black text-amber-700 mt-1">{stats.admins}</div>
          </div>
          <Crown className="w-8 h-8 text-amber-200" />
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase text-slate-500">Học viên</div>
            <div className="text-2xl font-black text-emerald-700 mt-1">{stats.students}</div>
          </div>
          <BookCheck className="w-8 h-8 text-emerald-200" />
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo email, tên hiển thị hoặc ID..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {(['all', 'super_admin', 'admin', 'student', 'guardian'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  roleFilter === r
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {r === 'all' ? 'Tất cả' : ROLE_LABELS[r]}
              </button>
            ))}
          </div>
        </div>

        {/* Accounts Table */}
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs animate-pulse">
            Đang tải danh sách tài khoản...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            Không tìm thấy tài khoản nào phù hợp.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[11px] border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Tài khoản</th>
                  <th className="py-3 px-4">Vai trò hiện tại</th>
                  <th className="py-3 px-4">Tiến độ</th>
                  <th className="py-3 px-4">Ngày tạo / Đăng nhập</th>
                  <th className="py-3 px-4">Thay đổi Role</th>
                  <th className="py-3 px-4 text-right">Xóa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => {
                  const draftRole = pendingRoles[u.id] || u.role;
                  const roleChanged = draftRole !== u.role;
                  const isSelf = actor?.id === u.id;
                  const isRoot = u.email.toLowerCase() === 'xuantam91@gmail.com';
                  const isProtected = u.is_protected || isSelf || isRoot;

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{u.display_name}</span>
                          {isSelf && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold">
                              Bạn
                            </span>
                          )}
                          {isRoot && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
                              Chủ sở hữu
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">{u.email}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                            ROLE_BADGE_CLASSES[u.role]
                          }`}
                        >
                          {ROLE_LABELS[u.role]}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-700">
                          {u.completed_lessons} bài xong
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {u.email_confirmed ? 'Đã xác thực' : 'Chờ xác nhận email'}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-[11px] text-slate-500 font-mono">
                        <div>Tạo: {u.created_at?.slice(0, 10) || '—'}</div>
                        <div>Login: {u.last_sign_in_at ? u.last_sign_in_at.slice(0, 10) : 'Chưa'}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        {canManage && !isProtected ? (
                          <div className="flex items-center gap-2">
                            <select
                              value={draftRole}
                              onChange={(e) =>
                                setPendingRoles((prev) => ({
                                  ...prev,
                                  [u.id]: e.target.value as AccountRole,
                                }))
                              }
                              aria-label={`Chọn role cho ${u.email}`}
                              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                              <option value="student">Học viên (student)</option>
                              <option value="guardian">Phụ huynh (guardian)</option>
                              <option value="admin">Admin (admin)</option>
                              <option value="super_admin">Super Admin (super_admin)</option>
                            </select>
                            {roleChanged && (
                              <button
                                type="button"
                                onClick={() => handleSaveRole(u)}
                                disabled={savingId === u.id}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer disabled:opacity-50"
                              >
                                <Save className="w-3.5 h-3.5" />
                                {savingId === u.id ? 'Đang lưu...' : 'Lưu'}
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">
                            {isProtected ? 'Tài khoản được bảo vệ' : 'Chỉ Super Admin được sửa'}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {canManage && !isProtected ? (
                          confirmDeleteId === u.id ? (
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(u)}
                                disabled={deletingId === u.id}
                                className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold cursor-pointer disabled:opacity-50"
                              >
                                {deletingId === u.id ? 'Đang xóa...' : 'Xác nhận'}
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-2 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-[11px] font-semibold cursor-pointer"
                              >
                                Hủy
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(u.id)}
                              title={`Xóa tài khoản ${u.email}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Xóa
                            </button>
                          )
                        ) : (
                          <span className="text-[11px] text-slate-300">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
