'use client';

import { IconMap } from '@/config/iconMap';
import { Account } from '@/lib/models';
import { Badge } from '../ui/badge';
import { useGetAccountPaginationQuery } from '@/app/state/account/accountsApi';
import { PaginationSearch } from '../pagination-search';
import { useState } from 'react';
import { AccountPaginationSortBy } from './pagination-filters';
import { Skeleton } from '../ui/skeleton';
import { SearchX } from 'lucide-react';
import Link from 'next/link';

export function AccountPaginationItem({
  account,
}: {
  account: Partial<Account>;
}) {
  return (
    <Link
      href={`/home/account/${account.accountId}`}
      className='flex w-full flex-row items-center gap-4'
    >
      <div
        className='flex h-fit w-fit flex-row items-center justify-center rounded-full p-2'
        style={{ backgroundColor: account.color }}
      >
        {account?.icon &&
          (() => {
            const SelectedIcon = IconMap[account.icon];
            return SelectedIcon ? <SelectedIcon className='size-5' /> : null;
          })()}
      </div>
      <div className='flex w-fit flex-col'>
        <div className='flex flex-row items-center gap-2'>
          <h1 className='text-muted-foreground max-w-[90vw] truncate overflow-hidden text-sm whitespace-nowrap'>
            {account.name}
          </h1>
          {account.isSavings && (
            <Badge className='bg-accent text-accent-foreground rounded-full px-2 py-0.5'>
              Savings
            </Badge>
          )}
        </div>
        <span className='text-xl font-medium'>
          ${account.total?.toFixed(2)}
        </span>
      </div>
    </Link>
  );
}

export function AccountPagination() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sort, setSort] = useState<string>('total,desc');

  const { data: result, isLoading } = useGetAccountPaginationQuery({
    page: 1,
    limit: 20,
    searchTerm,
    sortBy: sort.split(',')[0],
    sortOrder: sort.split(',')[1] as 'asc' | 'desc',
  });

  return (
    <div className='flex w-full flex-col gap-4'>
      <div className='flex flex-row items-center gap-2 md:w-1/3'>
        <PaginationSearch
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* TODO: Turn into dropdown menus for multiple filters etc, 
        display those filters on desktop, and truncate to a badge on mobile
        showing how many active filters there are */}
        {/* <div className='h-fit w-fit p-1'>
          <Filter className='size-5' />
        </div> */}
        <AccountPaginationSortBy value={sort} onValueChange={setSort} />
      </div>
      <div className='flex w-full flex-col gap-4'>
        {isLoading &&
          Array.from({ length: 3 }).map((item) => (
            <div
              className='flex w-full flex-row items-center gap-4'
              key={crypto.randomUUID()}
            >
              <Skeleton className='h-9 w-9 rounded-full' />
              <div className='flex flex-col gap-2'>
                <Skeleton className='h-2 w-20' />
                <Skeleton className='h-4 w-28' />
              </div>
            </div>
          ))}
        {result?.data && result.data.length === 0 && (
          <div className='text-muted flex flex-col items-center justify-center py-8'>
            <SearchX />
            <h1 className='text-xl'>Nothing to see here...</h1>
          </div>
        )}
        {result?.data &&
          result.data.length > 0 &&
          result.data.map((account: Partial<Account>) => (
            <AccountPaginationItem
              account={account}
              key={crypto.randomUUID()}
            />
          ))}
      </div>
    </div>
  );
}
