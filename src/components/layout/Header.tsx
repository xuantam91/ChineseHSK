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
  Compass,
  FolderGit2,
  BarChart3,
  Home,
} from 'lucide-react';
import { DEMO_USER_PROFILE } from '@/lib/mock-data';
import { getStoredUserProfile } from '@/lib/student-store';
import { TTSVoiceSelector } from '@/components/common/TTSVoiceSelector';

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
  }, [pathname]);

  const navLinks = [
    { href: '/dashboard', label: 'Học ngay', icon: Home },
    { href: '/roadmap', label: 'Lộ trình', icon: Compass },
    { href: '/library', label: 'Thư viện', icon: FolderGit2 },
    { href: '/progress', label: 'Tiến độ', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-700 text-white font-bold text-lg shadow-xs group-hover:bg-emerald-800 transition-colors">
            <span className="font-chinese">汉</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-slate-900">
                Chinese Journey
              </span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {profile.currentHskLevel || 'HSK 1'}
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-2 text-sm rounded-xl transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-semibold'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-emerald-700' : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Voice Switcher, Streak & Profile */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <TTSVoiceSelector variant="dropdown" />
          </div>

          {/* Streak Counter */}
          <div
            title="Chuỗi ngày học liên tục"
            className="flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-1.5 border border-amber-200 text-amber-900 text-xs sm:text-sm font-bold"
          >
            <Flame className="h-4 w-4 text-amber-600 fill-amber-500" />
            <span>{profile.streakCount || 5}</span>
          </div>

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 shadow-2xs hover:bg-slate-50 transition-colors"
              aria-label="Tài khoản cá nhân"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-700 text-white font-bold text-xs">
                {profile.displayName?.charAt(0) || 'M'}
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg z-50">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{profile.displayName}</p>
                  <p className="text-xs text-slate-500 truncate">{profile.email}</p>
                </div>

                <div className="py-1">
                  <Link
                    href="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-500" />
                    Cài đặt giọng đọc & Cấp độ
                  </Link>

                  {(profile.role === 'admin' || profile.role === 'super_admin') && (
                    <Link
                      href="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      {profile.role === 'super_admin' ? 'Super Admin CMS' : 'Quản trị viên (Admin)'}
                    </Link>
                  )}
                </div>

                <div className="pt-1 border-t border-slate-100">
                  <Link
                    href="/login"
                    onClick={() => {
                      setDropdownOpen(false);
                      fetch('/api/auth/me', { method: 'DELETE' }).catch(() => {});
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
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
