'use client';

import useAuth from '@/hooks/useAuth';
import { cn } from '@/utils/cn';
import { LogOut } from 'lucide-react';
import { redirect } from 'next/navigation';

export default function LogOutButton({ className }: { className?: string }) {
  const { signOut } = useAuth();

  return (
    <button
      className={cn(
        'text-destructive flex w-full cursor-pointer flex-row items-center gap-2 rounded-full',
        className,
      )}
      type='button'
      onClick={async () => {
        signOut();
        redirect('/auth/login');
      }}
    >
      <LogOut className='text-destructive size-4' />
      <span className='text-sm'>Log Out</span>
    </button>
  );
}
