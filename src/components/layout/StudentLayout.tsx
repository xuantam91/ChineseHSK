'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { MobileNav } from './MobileNav';

export interface StudentLayoutProps {
  children: React.ReactNode;
}

export function StudentLayout({ children }: StudentLayoutProps) {
  const pathname = usePathname();
  const isFocusedLesson =
    pathname?.startsWith('/lesson/') || pathname?.startsWith('/practice/');

  if (isFocusedLesson) {
    return <div className="min-h-screen bg-slate-50">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-12">{children}</main>
      <MobileNav />
    </div>
  );
}
