'use client';

import { useGetAllTransactionsQuery } from '@/app/state/transaction/transactionsApi';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { IconMap } from '@/config/iconMap';
import { useLocale } from '@/hooks/useLocale';
import { Transaction } from '@/lib/models';
import { cn } from '@/utils/cn';

function TransactionItemSkeleton() {
  return (
    <div className='flex flex-row items-center justify-between'>
      <div className='flex flex-row items-center gap-4'>
        <Skeleton className='h-10 w-10 rounded-full' />
        <Skeleton className='h-4 w-32' />
      </div>
      <Skeleton className='h-4 w-16' />
    </div>
  );
}

function TransactionItem({ transaction }: { transaction: Transaction }) {
  const isExpense = transaction.type === 'expense';

  return (
    <div className='flex flex-row items-center justify-between'>
      <div className='flex flex-row items-center gap-4'>
        <div
          className='h-fit w-fit rounded-full p-2'
          style={{ backgroundColor: transaction.categoryColor }}
        >
          {transaction.categoryIcon &&
            (() => {
              const SelectedIcon = IconMap[transaction.categoryIcon];
              return SelectedIcon ? <SelectedIcon className='size-5' /> : null;
            })()}
        </div>
        <h1 className='max-w-full truncate'>
          {transaction.notes?.trim() || transaction.categoryName}
        </h1>
      </div>
      <h2
        className={cn(
          isExpense ? 'text-red-400' : 'text-green-400',
          'font-bold',
        )}
      >
        {/* TODO: Fix transaction amount decimals */}
        {isExpense && '-'}${transaction.amount}
      </h2>
    </div>
  );
}

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
      {transactionsData &&
        Object.entries(transactionsData?.transactions).map(
          ([date, transactions]) => {
            return (
              <div key={date}>
                <div className='text-muted mb-2 text-sm'>
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
