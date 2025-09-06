'use client';

import useAuth from '@/hooks/useAuth';
import { cn } from '@/utils/cn';
import { LogOut } from 'lucide-react';
import { redirect } from 'next/navigation';
import { useSidebar } from './ui/sidebar';

export default function LogOutButton({ className }: { className?: string }) {
  const { signOut } = useAuth();
  const { state } = useSidebar();

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
      <span
        className={cn(
          'text-sm transition-all transition-discrete duration-150 ease-in-out',
          state === 'collapsed' && 'hidden opacity-0',
        )}
      >
        Log Out
      </span>
    </button>
  );
}
