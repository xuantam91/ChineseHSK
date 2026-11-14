'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Compass,
  FolderGit2,
  BarChart3,
  User,
  ShieldCheck,
  Flame,
  Award,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/Progress';
import { DEMO_USER_PROFILE } from '@/lib/mock-data';
import { getStoredUserProfile } from '@/lib/student-store';

export function Sidebar() {
  const pathname = usePathname();
  const [profile, setProfile] = useState(DEMO_USER_PROFILE);

  useEffect(() => {
    setProfile(getStoredUserProfile());
  }, []);

  const links = [
    { label: 'Trang chủ', href: '/dashboard', icon: Home, badge: 'Hôm nay' },
    { label: 'Lộ trình 12 tháng', href: '/roadmap', icon: Compass },
    { label: 'Thư viện học liệu', href: '/library', icon: FolderGit2, badge: 'Drive' },
    { label: 'Tiến độ & Điểm số', href: '/progress', icon: BarChart3 },
    { label: 'Cài đặt cấp độ', href: '/settings', icon: User },
  ];

  return (
    <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 left-0 border-r border-slate-200 bg-white p-4 pt-6 z-30">
      {/* Brand */}
      <Link href="/dashboard" className="flex items-center gap-3 px-2 mb-6 group">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-white font-bold text-xl shadow-xs group-hover:bg-emerald-800 transition-colors">
          <span className="font-chinese">汉</span>
        </div>
        <div>
          <span className="text-base font-bold text-slate-900 tracking-tight block">
            Chinese Journey
          </span>
          <span className="text-xs font-medium text-slate-500 tracking-wide block">
            Lộ trình HSK 3.0
          </span>
        </div>
      </Link>

      {/* Mini Profile Card */}
      <div className="mx-1 mb-5 p-3 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs sm:text-sm font-bold shadow-2xs">
            {profile.displayName?.charAt(0) || 'M'}
          </div>
          <div className="leading-tight">
            <span className="text-sm font-bold text-slate-900 block truncate max-w-[95px]">
              {profile.displayName || 'Minh Thư'}
            </span>
            <span className="text-xs font-semibold text-slate-600 bg-slate-200/70 px-1.5 py-0.5 rounded mt-0.5 inline-block">
              {profile.currentHskLevel || 'HSK 1'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-md text-amber-900 text-xs font-bold border border-amber-200">
          <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-600 stroke-[1.75]" />
          <span>{profile.streakCount || 5}</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive =
            pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors',
                isActive
                  ? 'bg-slate-100 text-slate-900 font-bold border border-slate-200/80'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    'w-4 h-4 shrink-0 stroke-[1.75]',
                    isActive ? 'text-slate-900' : 'text-slate-400'
                  )}
                />
                <span>{link.label}</span>
              </div>
              {link.badge && (
                <span
                  className={cn(
                    'text-[10px] font-semibold px-1.5 py-0.5 rounded',
                    isActive
                      ? 'bg-slate-200 text-slate-800'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  )}
                >
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="pt-5 px-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Quản trị
        </div>
        <Link
          href="/admin"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
        >
          <ShieldCheck className="w-4 h-4 shrink-0 text-slate-500 stroke-[1.75]" />
          <span>Admin CMS</span>
        </Link>
      </div>

      {/* Progress Footer Card */}
      <div className="mt-auto p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-900">
            Tháng 1 / 12
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-200">
            <Award className="w-3 h-3 text-slate-500" />
            <span>1.250 XP</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-500 font-medium">
            <span>Tiến độ tháng này</span>
            <span className="font-semibold text-slate-700">18%</span>
          </div>
          <Progress value={5} max={28} size="sm" />
        </div>
      </div>
    </aside>
  );
}
