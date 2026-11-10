'use client';

import React from 'react';
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
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin', label: 'Tổng quan', icon: LayoutDashboard },
  { href: '/admin/curriculum', label: 'Quản lý giáo trình', icon: BookOpen },
  { href: '/admin/assets', label: 'Quản lý Google Drive', icon: HardDrive },
  { href: '/admin/import', label: 'Import Notion', icon: FileDown },
  { href: '/admin/programs', label: 'Phiên bản chương trình', icon: GitBranch },
  { href: '/admin/users', label: 'Học viên & Thống kê', icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

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
                    <ShieldCheck className="w-3 h-3 mr-1" />
                    Admin CMS
                  </span>
                </div>
                <p className="text-xs text-slate-400 hidden sm:block">Trung tâm quản trị nội dung & học liệu</p>
              </div>
            </div>

            {/* Right Action: Return to Student App */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center text-xs text-slate-400 border-r border-slate-700 pr-4">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
                Đăng nhập: <strong className="text-slate-200 ml-1">Admin Giảng Viên</strong>
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
        {children}
      </main>

      {/* Admin Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        Chinese Learning Journey Admin CMS • Strict Server-Side Authorization • Timezone Asia/Ho_Chi_Minh
      </footer>
    </div>
  );
}
