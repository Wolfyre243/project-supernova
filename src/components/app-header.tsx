// This is an alternate header to SiteHeader, for mobile devices.
'use client';

import React from 'react';
import { NavUserMobile } from './nav/nav-user';
import { Button } from './ui/button';
import { Bell } from 'lucide-react';

export function AppHeader() {
  return (
    <nav className='flex flex-row items-center justify-between'>
      <NavUserMobile />
      <Button size={'icon'} variant={'ghost'}>
        <Bell className='size-6' stroke='#f9f9f9' />
      </Button>
    </nav>
  );
}

export function BalanceHeader() {
  // TODO: Fetch actual balance data here

  return (
    <div className='flex flex-col gap-4 text-[#f9f9f9]'>
      <h2 className='text-2xl font-semibold'>Hello, Wolfyre 👋</h2>
      <div>
        <h4>Total Balance</h4>
        <h1 className='text-4xl font-semibold'>$24,300.89</h1>
      </div>
    </div>
  );
}
