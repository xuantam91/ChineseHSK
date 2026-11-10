'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Flame, User, Settings, LogOut, ShieldCheck, ChevronDown, BookOpen } from 'lucide-react';
import { DEMO_USER_PROFILE } from '@/lib/mock-data';

export function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-[#fdfbf7]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-lg shadow-sm shadow-emerald-700/20 group-hover:bg-emerald-700 transition-colors">
              <span className="font-chinese text-xl">汉</span>
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-gray-900 group-hover:text-emerald-700 transition-colors">
                Chinese Journey
              </span>
              <span className="block text-[11px] font-medium text-emerald-700 tracking-wider uppercase">
                Lộ trình 12 tháng
              </span>
            </div>
          </Link>
        </div>

        {/* Center / Desktop Links */}
        <nav className="hidden md:flex items-center gap-1 bg-white/70 px-3 py-1.5 rounded-full border border-gray-200/60 shadow-xs">
          <Link
            href="/dashboard"
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors ${
              pathname === '/dashboard'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Trang chủ
          </Link>
          <Link
            href="/roadmap"
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors ${
              pathname.startsWith('/roadmap')
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Lộ trình 12 tháng
          </Link>
          <Link
            href="/library"
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors ${
              pathname === '/library'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Thư viện Drive
          </Link>
          <Link
            href="/progress"
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors ${
              pathname === '/progress'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Báo cáo tiến độ
          </Link>
        </nav>

        {/* Right Section: Streak & Profile */}
        <div className="flex items-center gap-3">
          {/* Streak Counter */}
          <div
            title="Chuỗi ngày học liên tục"
            className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 border border-amber-200/80 text-amber-800 shadow-xs"
          >
            <Flame className="h-4 w-4 fill-amber-500 text-amber-500 animate-bounce" />
            <span className="text-xs font-bold">{DEMO_USER_PROFILE.streakCount} ngày</span>
          </div>

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-white/80 transition-all border border-transparent hover:border-gray-200"
              aria-label="Menu cá nhân"
            >
              <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs border border-emerald-200">
                MT
              </div>
              <span className="hidden sm:inline-block text-xs font-medium text-gray-800 max-w-[100px] truncate">
                {DEMO_USER_PROFILE.displayName}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl animate-in fade-in zoom-in-95 duration-150 z-50">
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="text-xs font-bold text-gray-900">{DEMO_USER_PROFILE.displayName}</p>
                  <p className="text-[11px] text-gray-500 truncate">{DEMO_USER_PROFILE.email}</p>
                  <span className="inline-block mt-1 text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-medium">
                    Học viên (Asia/Ho_Chi_Minh)
                  </span>
                </div>

                <div className="py-1">
                  <Link
                    href="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-gray-500" />
                    Cài đặt tài khoản & Mục tiêu
                  </Link>

                  <Link
                    href="/roadmap"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <BookOpen className="w-4 h-4 text-gray-500" />
                    Lộ trình học tập
                  </Link>

                  <Link
                    href="/admin"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-emerald-700 rounded-xl hover:bg-emerald-50 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Quản trị viên (Admin CMS)
                  </Link>
                </div>

                <div className="pt-1 border-t border-gray-100">
                  <Link
                    href="/login"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors"
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
