import { AppHeader, BalanceHeader } from '@/components/app-header';
import React from 'react';

export default function UserHomePage() {
  return (
    <>
      {/* Mobile Header */}
      <header className='flex flex-col gap-6 p-6 md:hidden'>
        <AppHeader />
        <BalanceHeader />
      </header>

      <section className='bg-background flex min-h-full flex-col rounded-t-3xl p-6'>
        <h1>Hello World</h1>
      </section>
    </>
  );
}
