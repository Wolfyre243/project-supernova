import { cn } from '@/utils/cn';
import React from 'react';

export type ShortcutBadgeVariants = 'default' | 'background' | 'outline';

export function ShortcutBadgeGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-row items-center w-fit gap-2', className)}>
      {children}
    </div>
  );
}

export function ShortcutBadge({
  variant = 'default',
  className,
  children,
}: {
  variant?: ShortcutBadgeVariants;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        `rounded-lg w-fit h-fit text-muted-foreground text-sm`,
        variant === 'background' ? 'bg-muted px-2 py-1' : '',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function ShortcutPlusBadge() {
  return <div className={cn(`rounded-lg w-fit text-muted-foreground`)}>+</div>;
}
