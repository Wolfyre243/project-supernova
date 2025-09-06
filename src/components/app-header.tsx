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
