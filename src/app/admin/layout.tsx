'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  HardDrive,
  FileDown,
  GitBranch,
  Users,
  ArrowLeft,
  ShieldCheck,
  GraduationCap,
  Lock,
  Crown,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin', label: 'Tổng quan', icon: LayoutDashboard },
  { href: '/admin/curriculum', label: 'Quản lý giáo trình', icon: BookOpen },
  { href: '/admin/assets', label: 'Quản lý Google Drive', icon: HardDrive },
  { href: '/admin/import', label: 'Import Notion', icon: FileDown },
  { href: '/admin/programs', label: 'Phiên bản chương trình', icon: GitBranch },
  { href: '/admin/users', label: 'Tài khoản & Phân quyền', icon: Users },
];

interface SessionUser {
  id: string;
  email: string | null;
  display_name: string;
  role: string;
  is_super_admin: boolean;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [sessionMode, setSessionMode] = useState<'supabase' | 'mock'>('mock');
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((json) => {
        if (!active) return;
        setSessionMode(json?.data?.mode || 'mock');
        setSessionUser(json?.data?.user || null);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setCheckingAuth(false);
      });
    return () => {
      active = false;
    };
  }, [pathname]);

  const hasAdminAccess =
    sessionMode === 'mock'
      ? !sessionUser || sessionUser.role === 'admin' || sessionUser.role === 'super_admin'
      : Boolean(
          sessionUser &&
            (sessionUser.role === 'admin' || sessionUser.role === 'super_admin')
        );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Admin Top Bar */}
      <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Admin Badge */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-inner">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-lg tracking-tight">Chinese LMS</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {sessionUser?.role === 'super_admin' ? (
                      <>
                        <Crown className="w-3 h-3 mr-1 text-amber-300" />
                        Super Admin
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-3 h-3 mr-1" />
                        Admin CMS
                      </>
                    )}
                  </span>
                </div>
                <p className="text-xs text-slate-400 hidden sm:block">
                  Trung tâm quản trị nội dung & phân quyền hệ thống
                </p>
              </div>
            </div>

            {/* Right Action: Return to Student App */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center text-xs text-slate-300 border-r border-slate-700 pr-4">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
                <span>
                  {sessionUser?.email
                    ? `${sessionUser.display_name} (${sessionUser.email})`
                    : sessionUser?.display_name || 'Super Admin (Local)'}
                </span>
              </div>
              <Link
                href="/dashboard"
                className="inline-flex items-center text-xs font-medium px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                Về giao diện học viên
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-950 border-t border-slate-800 overflow-x-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-1 sm:space-x-2 py-2">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center whitespace-nowrap px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2 opacity-80" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {checkingAuth ? (
          <div className="py-16 text-center text-sm text-slate-500">
            Đang xác thực quyền quản trị viên...
          </div>
        ) : !hasAdminAccess ? (
          <div className="max-w-lg mx-auto mt-12 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Cần quyền Super Admin hoặc Admin
            </h2>
            <p className="text-sm text-slate-600">
              Tài khoản hiện tại không có quyền truy cập khu vực quản trị. Vui lòng đăng nhập bằng
              tài khoản quản trị (ví dụ <span className="font-mono font-semibold">xuantam91@gmail.com</span>).
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition"
              >
                Đăng nhập tài khoản Admin
              </Link>
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-semibold transition"
              >
                Về trang học tập
              </Link>
            </div>
          </div>
        ) : (
          children
        )}
      </main>

      {/* Admin Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        Chinese Learning Journey Admin CMS • Strict Server-Side Authorization • Timezone Asia/Ho_Chi_Minh
      </footer>
    </div>
  );
}
