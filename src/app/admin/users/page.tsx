'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  ShieldCheck,
  Calendar,
  Flame,
  Clock,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

interface AnonymizedUser {
  enrollment_id: string;
  user_id_short: string;
  age_group: string;
  enrollment_date: string;
  status: string;
  target_minutes: number;
  completed_lessons: number;
  total_lessons: number;
  completion_percentage: number;
  streak: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AnonymizedUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/users');
        const json = await res.json();
        if (json.success) {
          setUsers(json.data);
        }
      } catch (err) {
        console.error('Failed to load anonymized users', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center">
            <Users className="w-6 h-6 mr-2 text-indigo-600" />
            Học Viên & Thống Kê Tiến Độ (Ẩn Danh Bảo Mật)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Bảo vệ quyền riêng tư người học và trẻ em: Dữ liệu định danh được mã hóa một chiều, chỉ theo dõi tiến độ tổng hợp
          </p>
        </div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>COPPA & Child Privacy Compliant</span>
        </div>
      </div>

      {/* Privacy Notice Banner */}
      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-start space-x-3">
        <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-slate-800">Chính sách Bảo Vệ Dữ Liệu Học Viên</p>
          <p className="mt-0.5 leading-relaxed">
            Hệ thống tuân thủ nguyên tắc giảm thiểu dữ liệu (Data Minimization): Không hiển thị email, họ tên đầy đủ,
            hay ngày sinh chính xác trên bảng quản trị. Quản trị viên chỉ xem nhóm tuổi, ngày bắt đầu học và tỷ lệ hoàn thành bài học.
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Danh Sách Học Viên Đang Theo Học</h2>
          <span className="text-xs text-slate-500">{users.length} học viên ghi danh</span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs animate-pulse">
            Đang tải dữ liệu học viên...
          </div>
        ) : users.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            Chưa có học viên nào ghi danh.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[11px] border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Mã ẩn danh</th>
                  <th className="py-3 px-4">Nhóm độ tuổi</th>
                  <th className="py-3 px-4">Ngày bắt đầu</th>
                  <th className="py-3 px-4">Mục tiêu ngày</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4">Chuỗi học (Streak)</th>
                  <th className="py-3 px-4">Tiến độ bài học</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.enrollment_id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {u.user_id_short}
                    </td>
                    <td className="py-3.5 px-4 capitalize font-medium text-slate-700">
                      {u.age_group}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {u.enrollment_date}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {u.target_minutes} phút/ngày
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current mr-1"></span>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center font-bold text-amber-600">
                        <Flame className="w-3.5 h-3.5 mr-1" />
                        <span>{u.streak} ngày</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="w-40 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-slate-800">
                            {u.completed_lessons} / {u.total_lessons} bài
                          </span>
                          <span className="font-bold text-emerald-600">
                            {u.completion_percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${u.completion_percentage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
