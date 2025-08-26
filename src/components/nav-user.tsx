'use client';

import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import axios from 'axios';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Skeleton } from './ui/skeleton';
import { useSidebar } from './ui/sidebar';
import Link from 'next/link';
import { LogOut, Settings2 } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { redirect } from 'next/navigation';

// TODO: Should take reference from main User type instead
export type NavUserType = {
  // userId: string;
  username: string;
  name: string;
  email: string;
  role: number;
  avatarUrl?: string | null;
};

function UserHeader({ user }: { user: NavUserType }) {
  return (
    <div className='flex flex-row items-center gap-2'>
      <Avatar className='h-8 w-8 rounded-full shadow-lg'>
        <AvatarImage src={user.avatarUrl ?? ''} />
        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <span className='text-muted-foreground truncate leading-tight font-medium'>
        {user.name}
      </span>
    </div>
  );
}

export function NavUserSkeleton() {
  return (
    <div className='flex flex-row items-center gap-2'>
      <Skeleton className='h-8 w-8 rounded-full' />
      <div className='space-y-1'>
        <Skeleton className='h-2 w-[70px] rounded-full' />
        <Skeleton className='h-2 w-[50px] rounded-full' />
      </div>
    </div>
  );
}

export function NavUser() {
  const [user, setUser] = useState<NavUserType | null>(null);
  const [loading, setLoading] = useState(true);
  const { signOut } = useAuth();

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      try {
        const res = await axios.get('/api/user');
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  if (loading || !user) return <NavUserSkeleton />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='cursor-pointer outline-0'>
        <UserHeader user={user} />
        {/* <ChevronDown className='size-4' /> */}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
        align='end'
        sideOffset={4}
      >
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link
              href={'/home/settings'}
              className='flex w-full flex-row items-center gap-2'
            >
              <Settings2 />
              Settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          {/* Use AuthProvider's signOut and redirect to /auth/login */}
          <button
            className='text-destructive flex w-full cursor-pointer flex-row items-center gap-2'
            type='button'
            onClick={async () => {
              await signOut();
              redirect('/auth/login');
            }}
          >
            <LogOut className='text-destructive' />
            Log Out
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function NavUserMobile() {
  const [user, setUser] = useState<NavUserType | null>(null);
  const [loading, setLoading] = useState(true);
  const { toggleSidebar } = useSidebar();

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      try {
        const res = await axios.get('/api/user');
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  if (loading || !user)
    return <Skeleton className='bg-accent h-10 w-10 rounded-full' />;

  return (
    <button onClick={() => toggleSidebar()}>
      <Avatar className='h-10 w-10 rounded-full shadow-lg'>
        <AvatarImage src={user.avatarUrl ?? ''} />
        <AvatarFallback className='text-lg'>
          {user.name.charAt(0)}
        </AvatarFallback>
      </Avatar>
    </button>
  );
}
