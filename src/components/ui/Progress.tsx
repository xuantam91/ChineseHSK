import React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  max?: number;
  showLabel?: boolean;
  indicatorClassName?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Progress({
  value,
  max = 100,
  showLabel = false,
  className,
  indicatorClassName,
  size = 'md',
  ...props
}: ProgressProps) {
  const percentage = Math.min(Math.max(0, (value / max) * 100), 100);

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={cn('w-full', className)} {...props}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-medium text-gray-500 mb-1.5">
          <span>Tiến độ hoàn thành</span>
          <span className="font-semibold text-emerald-700">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={cn('w-full bg-gray-100 rounded-full overflow-hidden', heights[size])}>
        <div
          className={cn(
            'h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out',
            indicatorClassName
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
