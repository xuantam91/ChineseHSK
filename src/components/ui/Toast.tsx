'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

export interface ToastProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

export function Toast({
  type = 'info',
  title,
  message,
  onClose,
  className,
}: ToastProps) {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
    error: <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />,
    info: <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />,
  };

  const borders = {
    success: 'border-emerald-200 bg-emerald-50/90 text-emerald-950',
    error: 'border-red-200 bg-red-50/90 text-red-950',
    warning: 'border-amber-200 bg-amber-50/90 text-amber-950',
    info: 'border-blue-200 bg-blue-50/90 text-blue-950',
  };

  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 rounded-xl border p-4 shadow-lg backdrop-blur-sm transition-all animate-in slide-in-from-top-2 duration-300',
        borders[type],
        className
      )}
    >
      {icons[type]}
      <div className="flex-1 text-sm">
        {title && <p className="font-semibold mb-0.5 leading-snug">{title}</p>}
        <p className="text-sm opacity-90 leading-relaxed">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="rounded-lg p-1 text-gray-500 hover:bg-black/5 hover:text-gray-900 transition-colors"
          aria-label="Đóng thông báo"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
