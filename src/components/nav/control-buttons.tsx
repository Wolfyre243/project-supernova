'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/utils/cn';

export function BackButton({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className={cn('text-muted-foreground flex flex-row gap-2', className)}
    >
      {!children && (
        <>
          <ArrowLeft />
        </>
      )}
    </button>
  );
}
