'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, FolderGit2, BarChart3, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Trang chủ', href: '/dashboard', icon: Home },
    { label: 'Lộ trình', href: '/roadmap', icon: Compass },
    { label: 'Thư viện', href: '/library', icon: FolderGit2 },
    { label: 'Tiến độ', href: '/progress', icon: BarChart3 },
    { label: 'Cài đặt', href: '/settings', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 block md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-sm px-2 pb-safe">
      <div className="flex h-15 items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-colors',
                isActive
                  ? 'text-slate-900 font-bold'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              )}
            >
              <div
                className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-md transition-colors',
                  isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-400'
                )}
              >
                <Icon className="w-4 h-4 stroke-[1.75]" />
              </div>
              <span className="text-[11px] mt-0.5 leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
