import { AppHeader } from '@/components/app-header';
import { AccountsCard } from '@/components/dashboard/accounts-card';
import {
  BalanceCard,
  BalanceCardMobile,
} from '@/components/dashboard/balance-card';
import { ExpenseCard, IncomeCard } from '@/components/dashboard/cashflow-cards';
import { TransactionChartCard } from '@/components/transactions/statistics-card';
import React from 'react';

export default function UserHomePage() {
  return (
    <>
      {/* Mobile Header */}
      <header className='flex flex-col gap-6 p-6 md:hidden'>
        <AppHeader />
        <BalanceCardMobile />
      </header>

      <section className='bg-background flex flex-col gap-4 rounded-t-3xl p-4 pb-24 md:flex-row md:rounded-none md:pb-6'>
        <div className='flex h-full w-full flex-col gap-4 md:w-[80%]'>
          <div className='flex w-full flex-row items-center gap-4'>
            <BalanceCard />
            <IncomeCard />
            <ExpenseCard />
          </div>
          <div className='flex w-full flex-row gap-4'>
            <AccountsCard />
            <div className='bg-card hidden w-full rounded-2xl border p-4 md:flex'>
              Savings Card
            </div>
            <div className='bg-card hidden min-w-1/4 rounded-2xl border p-4 md:flex'>
              Quick Add Card
            </div>
          </div>
          <TransactionChartCard />
        </div>

        {/* Right Column, hidden on mobile */}
        <div className='bg-card hidden w-[20%] rounded-2xl border p-4 md:flex'></div>
      </section>
    </>
  );
}
