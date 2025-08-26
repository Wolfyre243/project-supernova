import React from 'react';
import { Separator } from '@radix-ui/react-separator';
import { SearchBar } from './searchbar';
import { Bell, Settings } from 'lucide-react';
import { ThemeToggler } from '../theme-provider';
import { NavUser } from './nav-user';

// TODO: Date should be fetched instead

// TODO: Add notification functionality
function NotificationButton() {
  return (
    <div className='border-muted w-fit rounded-full border p-2'>
      <Bell className='size-4' />
    </div>
  );
}

function SettingsButton() {
  return (
    <div className='border-muted w-fit rounded-full border p-2'>
      <Settings className='size-4' />
    </div>
  );
}

export default function SiteHeader() {
  return (
    <header className='bg-background sticky top-0 z-50 hidden h-(--header-height) flex-shrink-0 items-center gap-2 border-b shadow-md transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) md:flex'>
      <nav className='flex h-full w-full flex-row items-center justify-between gap-1 px-4 lg:gap-2'>
        {/* <SidebarTrigger className='-ml-1' /> */}
        {/* <Separator
          orientation='vertical'
          className='mx-2 data-[orientation=vertical]:h-4'
        /> */}

        <div className='hidden md:block'>
          {/* TODO: Add Breadcrumb */}
          {/* <LayoutBreadcrumb href={windowHref} /> */}
          <h1>Dashboard</h1>
        </div>

        {/* Search Bar */}
        <SearchBar />

        <div className='flex flex-row items-center gap-3'>
          <div className='flex flex-row items-center gap-3'>
            <ThemeToggler />
            <NotificationButton />
            <SettingsButton />
          </div>
          <Separator
            orientation='vertical'
            className='border-muted border-l-[0.5px] data-[orientation=vertical]:h-6'
          />
          <NavUser />
        </div>
      </nav>
      {/* TODO: Add mobile version */}
    </header>
  );
}
