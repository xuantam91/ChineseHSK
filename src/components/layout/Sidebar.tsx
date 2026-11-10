'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Compass,
  FolderGit2,
  BarChart3,
  User,
  ShieldCheck,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/Progress';
import { DEMO_USER_PROFILE } from '@/lib/mock-data';

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { label: 'Trang chủ', href: '/dashboard', icon: Home },
    { label: 'Lộ trình 12 tháng', href: '/roadmap', icon: Compass },
    { label: 'Thư viện Google Drive', href: '/library', icon: FolderGit2 },
    { label: 'Báo cáo & Thống kê', href: '/progress', icon: BarChart3 },
    { label: 'Cá nhân & Cài đặt', href: '/settings', icon: User },
  ];

  return (
    <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 left-0 border-r border-gray-100 bg-[#fdfbf7] p-4 pt-6 z-30">
      {/* Brand */}
      <Link href="/dashboard" className="flex items-center gap-3 px-2 mb-8 group">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white font-bold text-xl shadow-md shadow-emerald-700/20 group-hover:bg-emerald-700 transition-colors">
          <span className="font-chinese">汉</span>
        </div>
        <div>
          <span className="text-base font-extrabold text-gray-900 tracking-tight block">
            Chinese Journey
          </span>
          <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block">
            Tự học 12 tháng
          </span>
        </div>
      </Link>

      {/* Navigation Links */}
      <div className="flex-1 space-y-1.5">
        <div className="px-3 pb-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          Học tập
        </div>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive =
            pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all',
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                  : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'
              )}
            >
              <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-white' : 'text-gray-400')} />
              <span>{link.label}</span>
            </Link>
          );
        })}

        <div className="pt-6 px-3 pb-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          Hệ thống
        </div>
        <Link
          href="/admin"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors"
        >
          <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>Admin CMS</span>
        </Link>
      </div>

      {/* Mini Progress Card */}
      <div className="mt-auto p-4 rounded-2xl bg-white border border-gray-100 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Tháng 1 / 12</span>
          </div>
          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
            HSK 1
          </span>
        </div>
        <Progress value={18} max={100} size="sm" className="mb-2" />
        <p className="text-[11px] text-gray-500 leading-tight">
          Hoàn thành 5/28 ngày trong Tháng 1
        </p>
      </div>
    </aside>
  );
}
