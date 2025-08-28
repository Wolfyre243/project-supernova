import { AppHeader } from '@/components/app-header';
import {
  BalanceCard,
  BalanceCardMobile,
} from '@/components/dashboard/balance-card';
import React from 'react';

export default function UserHomePage() {
  return (
    <>
      {/* Mobile Header */}
      <header className='flex flex-col gap-6 p-6 md:hidden'>
        <AppHeader />
        <BalanceCardMobile />
      </header>

      <section className='bg-background flex min-h-full flex-col rounded-t-3xl p-6 md:rounded-none'>
        <BalanceCard />
      </section>
    </>
  );
}
