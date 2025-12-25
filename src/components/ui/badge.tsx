import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-full border-2 px-3 py-1 text-xs font-semibold transition-colors',
        {
          'bg-slate-900 text-white border-slate-900': variant === 'default',
          'bg-slate-100 text-slate-900 border-slate-200': variant === 'secondary',
          'bg-red-100 text-red-700 border-red-200': variant === 'destructive',
          'border-slate-200 text-slate-900 bg-white': variant === 'outline',
        },
        className
      )}
      {...props}
    />
  )
);
Badge.displayName = 'Badge';

export { Badge };
