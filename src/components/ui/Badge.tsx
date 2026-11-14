import React from 'react';
import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'info' | 'destructive' | 'locked' | 'outline';
  size?: 'sm' | 'md';
}

export function Badge({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-800 border-gray-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-medium',
    warning: 'bg-amber-50 text-amber-800 border-amber-200 font-medium',
    info: 'bg-blue-50 text-blue-700 border-blue-200 font-medium',
    destructive: 'bg-red-50 text-red-700 border-red-200 font-medium',
    locked: 'bg-gray-100 text-gray-400 border-gray-200',
    outline: 'border border-gray-300 text-gray-700 bg-transparent',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-0.5 rounded-md gap-1 font-semibold',
    md: 'text-sm px-3 py-1 rounded-lg gap-1.5 font-semibold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium border leading-none transition-colors select-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {variant === 'locked' && <Lock className="w-3 h-3 shrink-0" />}
      {children}
    </span>
  );
}
