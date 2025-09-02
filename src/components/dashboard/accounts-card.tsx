'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/utils/cn';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel';
import { useCallback, useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  HeartCrack,
  Plus,
  RotateCcw,
  SearchX,
} from 'lucide-react';
import { useGetAccountsQuery } from '@/app/state/account/accountsApi';
import { Account } from '@/lib/models';
import { IconMap } from '@/config/iconMap';
import { truncateString } from '@/utils/formatters';
import { formatDistanceToNowStrict } from 'date-fns';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';

function AccountCardSkeleton() {
  return (
    <div className='flex w-full flex-col gap-4 rounded-xl border-2 p-4 shadow-md'>
      <Skeleton className='h-8 w-8 rounded-full' />
      <div className='flex flex-col gap-1'>
        <Skeleton className='h-4 w-36 rounded-3xl' />
        <Skeleton className='h-5 w-30 rounded-4xl' />
      </div>
      <Skeleton className='h-3 w-40 rounded-full' />
    </div>
  );
}

function SingleAccountCard({ account }: { account: Partial<Account> }) {
  return (
    <div className='flex w-full flex-col gap-2 rounded-xl border-2 p-4'>
      <div
        className='flex w-fit flex-row items-center justify-center rounded-full p-2'
        style={{ backgroundColor: account.color || '#f9f9f9' }}
      >
        {account?.icon &&
          (() => {
            const SelectedIcon = IconMap[account.icon];
            return SelectedIcon ? (
              <SelectedIcon className='text-card size-4' />
            ) : null;
          })()}
      </div>
      <div>
        <h2 className='text-muted-foreground'>
          {truncateString(account.name ?? '', 24)}
        </h2>
        <h1 className='text-2xl font-semibold'>${account.total?.toFixed(2)}</h1>
      </div>
      <p className='text-muted text-sm'>
        Last Updated:{' '}
        {formatDistanceToNowStrict(account.updatedAt as Date, {
          addSuffix: true,
        })}
      </p>
    </div>
  );
}

export function AccountsCard({ className }: { className?: string }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const { data, isLoading, isError, error } = useGetAccountsQuery();

  const scrollPrev = useCallback(() => {
    if (api) api.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    if (api) api.scrollNext();
  }, [api]);

  const scrollTo = useCallback(
    (index: number) => {
      if (api) api.scrollTo(index);
    },
    [api],
  );

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div
      className={cn(
        'md:bg-card flex w-full flex-col gap-4 md:max-w-1/3 md:rounded-2xl md:border md:p-4',
        className,
      )}
    >
      <div className='flex flex-row items-center justify-between'>
        <h1 className='md:text-md text-xl font-semibold text-nowrap'>
          Accounts
        </h1>
        <Button size={'icon'} variant={'ghost'}>
          <Plus className='size-5' />
        </Button>
      </div>
      <div className='flex w-full flex-row items-center justify-center gap-2'>
        <button
          className={cn(
            'transition-all duration-200 ease-in-out',
            api?.canScrollPrev() ? '' : 'text-muted',
          )}
          disabled={!api?.canScrollPrev()}
          onClick={scrollPrev}
        >
          <ChevronLeft />
        </button>
        {isLoading && <AccountCardSkeleton />}
        {isError && error && (
          <div className='flex h-30 w-full flex-col items-center justify-center gap-2 rounded-2xl'>
            <HeartCrack className='text-muted' />
            <h1 className='text-muted'>Error fetching accounts...</h1>
            {/* TODO: Add retry functionality */}
            <Button
              size='sm'
              variant={'ghost'}
              className='text-muted-foreground text-sm'
            >
              <RotateCcw />
              Retry
            </Button>
          </div>
        )}
        {data?.length === 0 && (
          <div className='flex h-30 w-full flex-col items-center justify-center gap-2 rounded-2xl'>
            <SearchX className='text-muted' />
            <h1 className='text-muted'>Couldn&apos;t find any accounts!</h1>
          </div>
        )}
        {!isLoading && data && data?.length > 0 && (
          <Carousel setApi={setApi} className='flex h-fit flex-col'>
            <CarouselContent className='items-center'>
              {data.map((account: Partial<Account>) => {
                return (
                  <CarouselItem key={crypto.randomUUID()}>
                    <SingleAccountCard account={account} />
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        )}
        <button
          className={cn(
            'transition-all duration-200 ease-in-out',
            api?.canScrollNext() ? '' : 'text-muted',
          )}
          disabled={!api?.canScrollNext()}
          onClick={scrollNext}
        >
          <ChevronRight />
        </button>
      </div>
      {/* Indicators */}
      <div className='flex w-full flex-row items-center justify-center gap-2'>
        {Array.from({ length: data?.length as number }).map((item, i) => {
          if (i + 1 === current) {
            return (
              <button
                key={crypto.randomUUID()}
                className='bg-muted-foreground h-2 w-2 rounded-full'
              />
            );
          }
          return (
            <button
              key={crypto.randomUUID()}
              className='border-muted-foreground h-2 w-2 rounded-full border'
              onClick={() => scrollTo(i)}
            />
          );
        })}
      </div>
    </div>
  );
}
