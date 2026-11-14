'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Flame,
  Settings,
  LogOut,
  ShieldCheck,
  ChevronDown,
  BookOpen,
  Compass,
  FolderGit2,
  BarChart3,
  Home,
  Award,
} from 'lucide-react';
import { DEMO_USER_PROFILE } from '@/lib/mock-data';
import { getStoredUserProfile } from '@/lib/student-store';

export function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profile, setProfile] = useState(DEMO_USER_PROFILE);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setProfile(getStoredUserProfile());
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-700 text-white font-bold text-lg shadow-xs group-hover:bg-emerald-800 transition-colors">
              <span className="font-chinese">汉</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-slate-900">
                  Chinese Journey
                </span>
                <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {profile.currentHskLevel || 'HSK 1'}
                </span>
              </div>
              <span className="block text-xs text-slate-500 font-medium">
                Lộ trình 12 tháng HSK 3.0
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          <Link
            href="/dashboard"
            className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
              pathname === '/dashboard'
                ? 'bg-slate-100 text-slate-900 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Home className="w-4 h-4 text-slate-500 stroke-[1.75]" />
            <span>Trang chủ</span>
          </Link>
          <Link
            href="/roadmap"
            className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
              pathname.startsWith('/roadmap')
                ? 'bg-slate-100 text-slate-900 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Compass className="w-4 h-4 text-slate-500 stroke-[1.75]" />
            <span>Lộ trình</span>
          </Link>
          <Link
            href="/library"
            className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
              pathname === '/library'
                ? 'bg-slate-100 text-slate-900 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <FolderGit2 className="w-4 h-4 text-slate-500 stroke-[1.75]" />
            <span>Thư viện</span>
          </Link>
          <Link
            href="/progress"
            className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
              pathname === '/progress'
                ? 'bg-slate-100 text-slate-900 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-slate-500 stroke-[1.75]" />
            <span>Tiến độ</span>
          </Link>
        </nav>

        {/* Right Section: Crisp Metrics & Profile */}
        <div className="flex items-center gap-2.5">
          {/* XP Metric */}
          <div
            title="Điểm kinh nghiệm tích lũy (XP)"
            className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-1.5 border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold"
          >
            <Award className="h-4 w-4 text-slate-500 stroke-[2]" />
            <span>1.250 XP</span>
          </div>

          {/* Streak Counter */}
          <div
            title="Chuỗi ngày học liên tục"
            className="flex items-center gap-1.5 rounded-lg bg-amber-50/80 px-3 py-1.5 border border-amber-200 text-amber-900 text-xs sm:text-sm font-semibold"
          >
            <Flame className="h-4 w-4 text-amber-600 fill-amber-500 stroke-[1.75]" />
            <span>{profile.streakCount || 5} ngày</span>
          </div>

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 shadow-2xs hover:bg-slate-50 transition-colors focus:outline-hidden"
              aria-label="Tài khoản cá nhân"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-700 text-white font-bold text-xs sm:text-sm">
                {profile.displayName?.charAt(0) || 'M'}
              </div>
              <span className="hidden sm:inline-block text-sm font-medium text-slate-700 max-w-[100px] truncate">
                {profile.displayName || 'Minh Thư'}
              </span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg animate-in fade-in zoom-in-95 duration-100 z-50">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{profile.displayName}</p>
                  <p className="text-[11px] text-slate-500 truncate">{profile.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                    {profile.currentHskLevel || 'HSK 1'}
                  </span>
                </div>

                <div className="py-1">
                  <Link
                    href="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 rounded-md hover:bg-slate-50 transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-500" />
                    Cài đặt cấp độ & Mục tiêu
                  </Link>

                  <Link
                    href="/roadmap"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 rounded-md hover:bg-slate-50 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                    Lộ trình 12 tháng
                  </Link>

                  <Link
                    href="/admin"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 rounded-md hover:bg-slate-50 transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                    Quản trị viên (Admin)
                  </Link>
                </div>

                <div className="pt-1 border-t border-slate-100">
                  <Link
                    href="/login"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-rose-600 rounded-md hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    Đăng xuất
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
