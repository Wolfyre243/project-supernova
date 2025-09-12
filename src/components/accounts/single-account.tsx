'use client';

import React from 'react';
import { useGetSingleAccountQuery } from '@/app/state/account/accountsApi';
import { IconMap } from '@/config/iconMap';
import { Skeleton } from '../ui/skeleton';
import { formatDistanceToNowStrict } from 'date-fns';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Category } from '@/lib/models';

// Horizontal Bar Chart for Category Distribution
// TODO: Refactor into pie chart for now
function CategoryBarChart({
  data,
}: {
  data: (Partial<Category> & { count: number })[];
}) {
  if (!data || data.length === 0) {
    return (
      <div className='text-muted-foreground text-sm'>No data available.</div>
    );
  }
  const maxCount = Math.max(...data.map((c) => c.count), 1);
  return (
    <div className='flex flex-col gap-2'>
      {data.map((cat) => (
        <div key={cat.name} className='flex items-center gap-2'>
          {/* Icon */}
          {cat.icon && (
            <span
              className='flex h-6 w-6 items-center justify-center rounded-full'
              style={{ background: cat.color ?? '#e5e7eb' }}
            >
              {/* If IconMap is available, render icon, else fallback */}
              {typeof cat.icon === 'string' && IconMap[cat.icon] ? (
                React.createElement(IconMap[cat.icon])
              ) : (
                <span />
              )}
            </span>
          )}
          {/* Name */}
          <span className='min-w-[80px] flex-1 text-sm'>{cat.name}</span>
          {/* Bar */}
          <div className='flex-1'>
            <div
              className='bg-opacity-70 h-3 rounded'
              style={{
                width: `${(cat.count / maxCount) * 100}%`,
                background: cat.color ?? '#a3a3a3',
                minWidth: 8,
                transition: 'width 0.3s',
              }}
            />
          </div>
          {/* Count */}
          <span className='text-muted-foreground ml-2 text-xs'>
            {cat.count}
          </span>
        </div>
      ))}
    </div>
  );
}

export function SingleAccountBlock({ accountId }: { accountId: string }) {
  const { data: accountData, isLoading } = useGetSingleAccountQuery(accountId);

  return (
    <div className='flex h-full w-full flex-col gap-4'>
      {/* Title */}
      <h1 className='text-3xl font-semibold'>
        {!isLoading ? (
          accountData?.name
        ) : (
          <Skeleton className='h-8 w-48 rounded-full' />
        )}
      </h1>
      {/* Row 1 */}
      <div className='flex w-full flex-col gap-4 md:flex-row'>
        {/* Card Display */}
        <div className='flex w-full flex-col items-center justify-center gap-2 md:w-fit'>
          {/* Account Card */}
          {isLoading && (
            <div className='bg-card flex h-fit w-70 flex-col justify-center gap-3 self-center rounded-2xl border p-4 shadow-md'>
              <Skeleton className='h-10 w-10 rounded-full' />
              <div className='flex flex-col gap-2'>
                <Skeleton className='h-4 w-36' />
                <Skeleton className='h-7 w-30' />
              </div>
            </div>
          )}
          {accountData && (
            <>
              <div className='bg-card flex w-70 flex-col justify-center gap-2 rounded-2xl border p-4'>
                <div
                  className='h-fit w-fit rounded-full p-2'
                  style={{ backgroundColor: accountData?.color }}
                >
                  {accountData?.icon &&
                    (() => {
                      const SelectedIcon = IconMap[accountData.icon];
                      return SelectedIcon ? <SelectedIcon /> : null;
                    })()}
                </div>
                <div>
                  {/* Truncate account name */}
                  <h2 className='text-muted-foreground text-lg'>
                    {accountData?.name}
                  </h2>
                  <h1 className='text-3xl font-semibold'>
                    ${accountData?.total?.toFixed(2)}
                  </h1>
                </div>
              </div>
              <span className='text-muted text-sm'>
                Last Updated:{' '}
                {formatDistanceToNowStrict(accountData.updatedAt as Date)} ago
              </span>
            </>
          )}
        </div>
        {/* Income / Expense */}
        <div className='flex h-fit w-full flex-row gap-4'>
          {/* TODO: Replace with actual cards */}
        </div>
      </div>
    </div>
  );
}
