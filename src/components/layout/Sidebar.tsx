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
  Gem,
  Sparkles,
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
    <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 left-0 border-r border-emerald-100/60 bg-[#fdfbf7] p-4 pt-6 z-30">
      {/* Brand */}
      <Link href="/dashboard" className="flex items-center gap-3 px-2 mb-6 group">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 text-white font-black text-xl shadow-md shadow-emerald-700/25 group-hover:scale-105 transition-transform">
          <span className="font-chinese">汉</span>
        </div>
        <div>
          <span className="text-base font-black text-gray-900 tracking-tight block">
            Chinese Journey
          </span>
          <span className="text-[11px] font-bold text-emerald-700 tracking-wide block">
            Lộ trình HSK 3.0
          </span>
        </div>
      </Link>

      {/* Mini Profile Pill */}
      <div className="mx-1 mb-5 p-2.5 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-sm shadow-xs">
            <span>🐼</span>
          </div>
          <div className="leading-tight">
            <span className="text-xs font-bold text-gray-900 block truncate max-w-[100px]">
              {profile.displayName || 'Minh Thư'}
            </span>
            <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
              {profile.currentHskLevel || 'HSK 1'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg text-amber-800 text-[11px] font-bold">
          <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-bounce" />
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
                'flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold transition-all',
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-700/20'
                  : 'text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-xs'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    'w-4 h-4 shrink-0',
                    isActive ? 'text-white' : 'text-gray-400'
                  )}
                />
                <span>{link.label}</span>
              </div>
              {link.badge && (
                <span
                  className={cn(
                    'text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md',
                    isActive
                      ? 'bg-emerald-700/80 text-emerald-100'
                      : 'bg-emerald-50 text-emerald-800'
                  )}
                >
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="pt-5 px-3 pb-1 text-[10px] font-black text-gray-400 uppercase tracking-wider">
          Hệ thống
        </div>
        <Link
          href="/admin"
          className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition-colors"
        >
          <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>Admin CMS</span>
        </Link>
      </div>

      {/* Mini Progress Card */}
      <div className="mt-auto p-3.5 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Tháng 1 / 12</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-black text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
            <Gem className="w-2.5 h-2.5 text-indigo-600" />
            <span>+1.250 XP</span>
          </div>
        </div>
        <Progress value={18} max={100} size="sm" />
        <div className="flex items-center justify-between text-[10px] text-gray-500 font-semibold">
          <span>5/28 ngày hoàn thành</span>
          <span className="text-emerald-700 font-bold">18%</span>
        </div>
      </div>
    </aside>
  );
}
