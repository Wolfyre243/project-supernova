// import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { BackButton } from '@/components/nav/control-buttons';
import { MoreVertical } from 'lucide-react';
import {
  AccountDisplayCard,
  AccountTitle,
} from '@/components/accounts/single-account/display-card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  AccountExpenseStatCard,
  AccountIncomeStatCard,
} from '@/components/accounts/single-account/stats-cards';
import Link from 'next/link';
import { AccountTransactionList } from '@/components/accounts/single-account/transaction-list';
import { TransactionChart } from '@/components/transactions/transaction-charts';

export default async function DashboardSingleAccountPage({
  params,
}: {
  params: Promise<{ accountId: string }>;
}) {
  const { accountId } = await params;

  return (
    <div className='bg-background flex h-full flex-col gap-4 p-4 pb-24 md:pb-4'>
      <div className='text-muted-foreground mb-2 flex flex-row justify-between md:hidden'>
        <BackButton />
        {/* TODO: Replace with real dropdown menu */}
        <MoreVertical className='size-5' />
      </div>
      <div className='flex h-full w-full flex-col gap-4'>
        {/* Title */}
        <AccountTitle accountId={accountId} />
        {/* Row 1 */}
        <div className='flex w-full flex-col gap-4 md:flex-row'>
          {/* Card Display */}
          <AccountDisplayCard accountId={accountId} />

          <TransactionChart accountIds={[accountId]} />

          {/* Income / Expense */}
          <Tabs defaultValue='income' className='w-full'>
            <TabsList className='w-full'>
              <TabsTrigger
                value='income'
                className='rounded-r-none border-none'
              >
                <ChevronUp className='text-green-500' />
                Income
              </TabsTrigger>
              <TabsTrigger
                value='expense'
                className='rounded-l-none border-none'
              >
                <ChevronDown className='text-red-500' />
                Expense
              </TabsTrigger>
            </TabsList>
            <TabsContent value='income'>
              <AccountIncomeStatCard accountId={accountId} />
            </TabsContent>
            <TabsContent value='expense'>
              <AccountExpenseStatCard accountId={accountId} />
            </TabsContent>
          </Tabs>
        </div>
        {/* Row 2 */}
        <div className='flex w-full flex-col gap-4 md:flex-row'>
          {/* Put transaction chart here on desktop */}
          {/* <TransactionChart accountIds={[accountId]} /> */}
        </div>
        {/* Row 3 */}
        <div className='flex w-full flex-col gap-4 md:flex-row'>
          {/* Transactions */}
          <div className='flex flex-col gap-4'>
            <div className='flex flex-row items-baseline justify-between'>
              <h1 className='text-xl'>Transactions</h1>
              <Link
                href={'/home/activity'}
                className='text-muted-foreground text-xs underline'
              >
                See All
              </Link>
            </div>
            <AccountTransactionList accountId={accountId} />
          </div>
        </div>
      </div>
    </div>
  );
}
