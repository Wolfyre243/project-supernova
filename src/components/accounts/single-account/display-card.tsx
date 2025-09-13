'use client';

import { useGetSingleAccountQuery } from '@/app/state/account/accountsApi';
import { Skeleton } from '@/components/ui/skeleton';
import { IconMap } from '@/config/iconMap';
import { formatDistanceToNowStrict } from 'date-fns';

export function AccountTitle({ accountId }: { accountId: string }) {
  const { data: accountData, isLoading } = useGetSingleAccountQuery(accountId);

  return (
    <h1 className='text-3xl font-semibold'>
      {!isLoading ? (
        accountData?.name
      ) : (
        <Skeleton className='h-8 w-48 rounded-full' />
      )}
    </h1>
  );
}

export function AccountDisplayCard({ accountId }: { accountId: string }) {
  const { data: accountData, isLoading } = useGetSingleAccountQuery(accountId);

  return (
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
  );
}
