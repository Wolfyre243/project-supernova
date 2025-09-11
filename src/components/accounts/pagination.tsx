'use client';

import { IconMap } from '@/config/iconMap';
import { Account } from '@/lib/models';
import { Badge } from '../ui/badge';
import { useGetAccountPaginationQuery } from '@/app/state/account/accountsApi';
import { PaginationSearch } from '../pagination-search';
import { ArrowUpDown, Filter } from 'lucide-react';
import { useState } from 'react';
import { AccountPaginationSortBy } from './pagination-filters';

export function AccountPaginationItem({
  account,
}: {
  account: Partial<Account>;
}) {
  return (
    <div className='flex w-full flex-row items-center gap-4'>
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
          <h1 className='text-muted-foreground max-w-[160px] truncate overflow-hidden text-sm whitespace-nowrap'>
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
    </div>
  );
}

export function AccountPagination() {
  const [searchTerm, setSearchTerm] = useState<string | undefined>();
  const [sort, setSort] = useState<string>('total,desc');

  const { data: result } = useGetAccountPaginationQuery({
    page: 1,
    limit: 10,
    searchTerm,
    sortBy: sort.split(',')[0],
    sortOrder: sort.split(',')[1] as 'asc' | 'desc',
  });

  return (
    <div className='flex w-full flex-col gap-4'>
      <div className='flex flex-row items-center gap-2'>
        <PaginationSearch onChange={(e) => setSearchTerm(e.target.value)} />
        {/* TODO: Turn into dropdown menus for multiple filters etc, 
        display those filters on desktop, and truncate to a badge on mobile
        showing how many active filters there are */}
        {/* <div className='h-fit w-fit p-1'>
          <Filter className='size-5' />
        </div> */}
        <AccountPaginationSortBy value={sort} onValueChange={setSort} />
      </div>
      <div className='flex w-full flex-col gap-4'>
        {result?.data &&
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
