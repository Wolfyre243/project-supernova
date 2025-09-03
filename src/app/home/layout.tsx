import React from 'react';
import { cookies } from 'next/headers';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/nav/app-sidebar';
import SiteHeader from '@/components/nav/site-header';
import RequireAuth from '@/components/require-auth';
import BottomBar from '@/components/nav/bottom-bar';

export default async function UserHomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  return (
    <RequireAuth>
      <SidebarProvider
        defaultOpen={defaultOpen}
        style={
          {
            '--sidebar-width': 'calc(var(--spacing) * 60)',
            '--header-height': 'calc(var(--spacing) * 13)',
          } as React.CSSProperties
        }
      >
        <AppSidebar />
        <SidebarInset>
          <main className='bg-homepage-gradient flex flex-1 flex-col lg:bg-none'>
            <SiteHeader />
            <div className='flex h-full min-h-screen flex-1 flex-col'>
              {children}
            </div>
          </main>
          <div className='fixed right-0 bottom-0 left-0 z-50 w-full md:hidden'>
            <BottomBar />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </RequireAuth>
  );
}
