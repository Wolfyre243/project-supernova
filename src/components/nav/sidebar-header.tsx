'use client';

import { cn } from '@/utils/cn';
import { SidebarTrigger, useSidebar } from '../ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggleBar } from '../theme-provider';
import { useGetUserDetailsQuery } from '@/app/state/userDetails/userDetailsApiSlice';
import { Skeleton } from '../ui/skeleton';

export function AppSidebarHeaderSkeleton() {
  return (
    <div className='flex w-full flex-col gap-2'>
      <div className='flex h-full w-full flex-row items-center gap-4 px-2 py-6'>
        <Skeleton className='h-12 w-12 rounded-full' />
        <div className='space-y-1'>
          <Skeleton className='h-3 w-[50px] rounded-full' />
          <Skeleton className='h-2 w-[90px] rounded-full' />
        </div>
      </div>
      <ThemeToggleBar />
    </div>
  );
}

export function AppSidebarHeader() {
  const { state } = useSidebar();
  const isMobile = useIsMobile();

  const { data, isError, isLoading, error } = useGetUserDetailsQuery();

  // Mobile variant
  if ((isLoading || isError) && isMobile) {
    if (isError) console.error(error);
    return <AppSidebarHeaderSkeleton />;
  }
  if (isMobile)
    return (
      <div className='flex w-full flex-col gap-2'>
        <div className='flex h-full w-full flex-row items-center gap-4 px-2 py-6'>
          <Avatar className='h-12 w-12 rounded-full shadow-lg'>
            {/* <AvatarImage src={user.avatarUrl ?? ''} /> */}
            <AvatarImage src={''} />
            <AvatarFallback className='text-2xl'>
              {data?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className='flex h-full max-w-full flex-col justify-center'>
            <span className='max-w-[200px] truncate text-xl'>{data?.name}</span>
            <span className='text-muted-foreground max-w-[200px] truncate text-sm'>
              {data?.email}
            </span>
          </div>
        </div>
        <ThemeToggleBar />
      </div>
    );

  // Desktop variant
  return (
    <div className='flex h-full w-fit flex-row items-center gap-2 py-1'>
      <div className='flex aspect-square size-8 items-center justify-center rounded-lg'>
        <SidebarTrigger />
      </div>
      <div
        className={cn(
          'flex flex-col text-left text-lg leading-tight',
          state === 'collapsed' && 'hidden',
        )}
      >
        <h1 className='font-medium'>Nova</h1>
        {/* <span className='text-muted-foreground/50 text-xs'>
                  Track your finance
                </span> */}
      </div>
    </div>
  );
}
