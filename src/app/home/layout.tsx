import React from 'react';
import { cookies } from 'next/headers';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import SiteHeader from '@/components/site-header';
import RequireAuth from '@/components/require-auth';

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
            '--sidebar-width': 'calc(var(--spacing) * 72)',
            '--header-height': 'calc(var(--spacing) * 13)',
          } as React.CSSProperties
        }
      >
        <AppSidebar />
        <SidebarInset>
          <main className='bg-homepage-gradient @container/main flex min-h-screen flex-1 flex-col lg:bg-none'>
            <SiteHeader />
            <div className='flex h-full flex-col overflow-y-scroll'>
              {children}
            </div>
            <div className='sticky bottom-0 z-50 block w-full bg-white md:hidden'>
              <h1>hello</h1>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </RequireAuth>
  );
}
