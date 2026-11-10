import React from 'react';
import { StudentLayout } from '@/components/layout/StudentLayout';

export default function StudentAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StudentLayout>{children}</StudentLayout>;
}
