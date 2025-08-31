import { AppHeader } from '@/components/app-header';
import {
  BalanceCard,
  BalanceCardMobile,
} from '@/components/dashboard/balance-card';
import { ExpenseCard, IncomeCard } from '@/components/dashboard/cashflow-cards';
import React from 'react';

export default function UserHomePage() {
  return (
    <>
      {/* Mobile Header */}
      <header className='flex flex-col gap-6 p-6 md:hidden'>
        <AppHeader />
        <BalanceCardMobile />
      </header>

      <section className='bg-background flex min-h-full flex-col gap-4 rounded-t-3xl p-6 md:flex-row md:rounded-none'>
        <div className='flex w-full flex-col gap-4 md:w-3/4'>
          <div className='flex w-full flex-row gap-4'>
            <BalanceCard />
            <IncomeCard />
            <ExpenseCard />
          </div>
          <div className='flex w-full flex-row gap-4'></div>
        </div>

        {/* Right Column, hidden on mobile */}
        <div className='w-1/4'></div>
      </section>
    </>
  );
}
