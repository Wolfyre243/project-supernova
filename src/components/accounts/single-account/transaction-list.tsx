'use client';

import { useGetAllTransactionsQuery } from '@/app/state/transaction/transactionsApi';
import {
  TransactionItem,
  TransactionItemSkeleton,
} from '@/components/transactions/transaction-item';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Separator } from '@/components/ui/separator';
import { useLocale } from '@/hooks/useLocale';
import { Transaction } from '@/lib/models';
import { ListX } from 'lucide-react';

export function AccountTransactionList({ accountId }: { accountId: string }) {
  const locale = useLocale();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const { data: transactionsData, isLoading } = useGetAllTransactionsQuery({
    accountIds: [accountId],
    groupBy: 'date',
  });
  console.log(transactionsData?.transactions ?? {});

  if (isLoading) {
    return (
      <div className='flex flex-col gap-4'>
        {Array.from({ length: 5 }).map(() => (
          <TransactionItemSkeleton key={crypto.randomUUID()} />
        ))}
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4'>
      {/* TODO: Add more controls to allow user to pick a month from this year, can take inspo from POSB */}
      {transactionsData && transactionsData.transactions.length !== 0 ? (
        Object.entries(transactionsData?.transactions).map(
          ([date, transactions]) => {
            return (
              <div key={date}>
                <div className='text-muted mb-2 text-sm font-medium'>
                  {new Date(date).toLocaleDateString(locale, {
                    timeZone: timezone,
                    weekday: 'long',
                    month: 'long',
                    day: '2-digit',
                  })}
                </div>
                <div className='flex flex-col gap-2'>
                  {(Array.isArray(transactions)
                    ? transactions
                    : [transactions]
                  ).map((transaction: Transaction) => (
                    <TransactionItem
                      transaction={transaction}
                      key={crypto.randomUUID()}
                    />
                  ))}
                </div>
              </div>
            );
          },
        )
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant='default'>
              <ListX className='size-8' />
            </EmptyMedia>
          </EmptyHeader>
          <EmptyTitle>No transaction data found!</EmptyTitle>
        </Empty>
      )}
      {/* End */}
      <Separator />
      <div className='text-muted flex w-full flex-col items-center justify-center gap-1 text-xs'>
        <span>Showing {transactionsData?.count ?? 0} transactions</span>
        <span>{new Date().toLocaleDateString(locale, { month: 'long' })}</span>
      </div>
    </div>
  );
}
