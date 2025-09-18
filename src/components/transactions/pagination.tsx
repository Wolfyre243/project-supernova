'use client';

import { useState } from 'react';
import { PaginationSearch } from '../pagination-search';
import { useGetAllTransactionsQuery } from '@/app/state/transaction/transactionsApi';
import { SearchX } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';
import { TransactionItem, TransactionItemSkeleton } from './transaction-item';
import { Transaction } from '@/lib/models';
import { TransactionsFilterMenu } from './pagination-filters';
import { selectTransactionFilters } from '@/app/state/transaction/transactionFiltersSlice';
import { useAppSelector } from '@/hooks/redux-hooks';

export function TransactionPagination() {
  const locale = useLocale();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [searchTerm, setSearchTerm] = useState<string>('');
  const filters = useAppSelector(selectTransactionFilters);

  const { data, isLoading } = useGetAllTransactionsQuery({
    // page: 1,
    // limit: 20,
    groupBy: 'date',
    searchTerm,
    ...filters,
    // sortBy: sort.split(',')[0],
    // sortOrder: sort.split(',')[1] as 'asc' | 'desc',
  });

  return (
    <div className='flex w-full flex-col gap-4'>
      {/* TODO: Add a better transition when scrolling to set searchbar to sticky */}
      {/* sticky md:relative top-0 bg-background py-4 */}
      <div className='flex flex-row items-center gap-2 md:w-1/3'>
        <PaginationSearch
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <TransactionsFilterMenu />
      </div>
      <div className='flex w-full flex-col gap-4'>
        {isLoading &&
          Array.from({ length: 5 }).map(() => (
            <TransactionItemSkeleton key={crypto.randomUUID()} />
          ))}
        {data?.transactions && data.transactions.length === 0 && (
          <div className='text-muted flex flex-col items-center justify-center py-8'>
            <SearchX />
            <h1 className='text-xl'>Nothing to see here...</h1>
          </div>
        )}
        {data &&
          Object.entries(data?.transactions).map(([date, transactions]) => {
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
          })}
      </div>
    </div>
  );
}
