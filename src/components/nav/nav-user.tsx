'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Skeleton } from '../ui/skeleton';
import { useSidebar } from '../ui/sidebar';
import Link from 'next/link';
import { Settings2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import LogOutButton from '../logout-btn';
import { useGetUserDetailsQuery } from '@/app/state/user/userApi';
import { UserDetails } from '@/lib/models';

function UserHeader({ user }: { user: UserDetails }) {
  return (
    <div className='flex flex-row items-center gap-2'>
      <Avatar className='h-8 w-8 rounded-full shadow-lg'>
        <AvatarImage src={user.avatarUrl ?? ''} />
        <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
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
  const isMobile = useIsMobile();

  const { data, isError, isLoading, error } = useGetUserDetailsQuery();

  // Do not render on mobile
  if (isMobile) return null;

  if (isLoading) return <NavUserSkeleton />;
  if (isError || !data) {
    console.error(error);
    return (
      <div className='flex flex-row items-center gap-2'>
        {/* TODO: Replace will fallback error pfp */}
        <div className='bg-muted/50 flex h-8 w-8 items-center justify-center rounded-full'>
          !
        </div>
        <div className='space-y-1'>
          <p>Unknown</p>
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='cursor-pointer outline-0'>
        <UserHeader user={data} />
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
        <DropdownMenuItem className='hover:bg-muted focus:bg-muted/40 dark:hover:bg-muted'>
          {/* Use AuthProvider's signOut and redirect to /auth/login */}
          <LogOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function NavUserMobile() {
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();

  const { data, isError, isLoading, error } = useGetUserDetailsQuery();

  // Do not render on desktop
  if (!isMobile) return null;

  if (isLoading)
    return <Skeleton className='bg-accent h-10 w-10 rounded-full' />;
  if (isError || !data) {
    console.error(error);
    return (
      <Avatar className='h-10 w-10 rounded-full shadow-lg'>
        {/* TODO: Add fallback avatar for error */}
        <AvatarImage src={''} />
        <AvatarFallback className='text-lg'>{'!'}</AvatarFallback>
      </Avatar>
    );
  }

  return (
    <button onClick={() => toggleSidebar()}>
      <Avatar className='h-10 w-10 rounded-full shadow-lg'>
        <AvatarImage src={data?.avatarUrl ?? ''} />
        <AvatarFallback className='text-lg'>
          {data?.name?.charAt(0)}
        </AvatarFallback>
      </Avatar>
    </button>
  );
}
