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
    <div className={cn('flex w-fit flex-row items-center gap-2', className)}>
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
        `text-muted-foreground h-fit w-fit rounded-lg text-sm`,
        variant === 'background' ? 'bg-muted px-2 py-1' : '',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function ShortcutPlusBadge() {
  return <div className={cn(`text-muted-foreground w-fit rounded-lg`)}>+</div>;
}
