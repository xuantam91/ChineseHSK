'use client';

import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';

export interface StudentLayoutProps {
  children: React.ReactNode;
}

export function StudentLayout({ children }: StudentLayoutProps) {
  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col">
      <Sidebar />
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 pb-20 md:pb-12">
          {children}
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
