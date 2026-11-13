'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Flame,
  User,
  Settings,
  LogOut,
  ShieldCheck,
  ChevronDown,
  BookOpen,
  Sparkles,
  Compass,
  FolderGit2,
  BarChart3,
  Home,
  Gem,
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
    <header className="sticky top-0 z-40 w-full border-b border-emerald-100/60 bg-[#fdfbf7]/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 text-white font-black text-xl shadow-md shadow-emerald-700/25 group-hover:scale-105 transition-transform">
              <span className="font-chinese">汉</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-tight text-gray-900 group-hover:text-emerald-700 transition-colors">
                  Chinese Journey
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100/80 text-emerald-800 px-1.5 py-0.5 rounded-md">
                  {profile.currentHskLevel || 'HSK 1'}
                </span>
              </div>
              <span className="block text-[11px] font-semibold text-emerald-700 tracking-wide">
                Lộ trình 12 tháng • Chuẩn HSK 3.0
              </span>
            </div>
          </Link>
        </div>

        {/* Center / Desktop Links with visual icons */}
        <nav className="hidden md:flex items-center gap-1 bg-white/80 p-1.5 rounded-full border border-gray-200/70 shadow-xs">
          <Link
            href="/dashboard"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-full transition-all ${
              pathname === '/dashboard'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Trang chủ</span>
          </Link>
          <Link
            href="/roadmap"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-full transition-all ${
              pathname.startsWith('/roadmap')
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Lộ trình</span>
          </Link>
          <Link
            href="/library"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-full transition-all ${
              pathname === '/library'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Thư viện</span>
          </Link>
          <Link
            href="/progress"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-full transition-all ${
              pathname === '/progress'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Tiến độ</span>
          </Link>
        </nav>

        {/* Right Section: Gamification Badges & Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* XP Gems Badge */}
          <div
            title="Điểm kinh nghiệm tích lũy (XP)"
            className="flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1.5 border border-indigo-200/80 text-indigo-700 shadow-xs hover:scale-105 transition-transform"
          >
            <Gem className="h-3.5 w-3.5 text-indigo-600 fill-indigo-200 animate-pulse" />
            <span className="text-xs font-black">1.250</span>
          </div>

          {/* Streak Counter */}
          <div
            title="Chuỗi ngày học liên tục"
            className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1.5 border border-amber-200/80 text-amber-800 shadow-xs hover:scale-105 transition-transform"
          >
            <Flame className="h-4 w-4 fill-amber-500 text-amber-500 animate-bounce" />
            <span className="text-xs font-black">{profile.streakCount || 5}</span>
          </div>

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 rounded-full border border-gray-200 bg-white p-1 pr-2.5 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all focus:outline-hidden"
              aria-label="Tài khoản cá nhân"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs ring-2 ring-emerald-500/20">
                <span>🐼</span>
              </div>
              <span className="hidden sm:inline-block text-xs font-bold text-gray-800 max-w-[90px] truncate">
                {profile.displayName || 'Minh Thư'}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl animate-in fade-in zoom-in-95 duration-150 z-50">
                <div className="px-3 py-2.5 border-b border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">🐼</span>
                    <div>
                      <p className="text-xs font-bold text-gray-900">{profile.displayName}</p>
                      <span className="inline-block text-[10px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded font-black">
                        {profile.currentHskLevel || 'HSK 1'} • Sơ cấp
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-400 truncate">{profile.email}</p>
                </div>

                <div className="py-1">
                  <Link
                    href="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-gray-500" />
                    Cài đặt cấp độ & Mục tiêu
                  </Link>

                  <Link
                    href="/roadmap"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    Lộ trình 12 tháng
                  </Link>

                  <Link
                    href="/admin"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-emerald-700 rounded-xl hover:bg-emerald-50 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Quản trị viên (Admin CMS)
                  </Link>
                </div>

                <div className="pt-1 border-t border-gray-100">
                  <Link
                    href="/login"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
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
