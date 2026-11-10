import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'destructive' | 'secondary';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';

    const variants = {
      primary:
        'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 shadow-sm shadow-emerald-700/20',
      outline:
        'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-emerald-500 bg-white',
      ghost:
        'text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-300',
      destructive:
        'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm shadow-red-700/20',
      secondary:
        'bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-500 shadow-sm shadow-amber-600/20',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 gap-1.5 min-h-[34px]',
      md: 'text-sm px-4 py-2.5 gap-2 min-h-[42px]',
      lg: 'text-base px-6 py-3.5 gap-2.5 min-h-[50px] font-semibold',
      icon: 'h-10 w-10 p-0 rounded-xl',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
