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
} from '@/components/accounts/single-account/stats-tabs';

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

          {/* Income / Expense */}
          <div className='flex h-fit w-full flex-row gap-4'>
            <Tabs defaultValue='income' className='w-full'>
              <TabsList className='w-full bg-transparent'>
                <TabsTrigger value='income'>
                  <ChevronUp className='text-green-500' />
                  Income
                </TabsTrigger>
                <TabsTrigger value='expense'>
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
        </div>
      </div>
    </div>
  );
}
