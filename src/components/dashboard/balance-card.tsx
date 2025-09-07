'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import { useGetUserDetailsQuery } from '@/app/state/user/userApi';
import {
  useGetBalanceQuery,
  useGetTransactionStatsQuery,
} from '@/app/state/transaction/transactionsApi';
import { Skeleton } from '../ui/skeleton';
import { ChartConfig, ChartContainer } from '../ui/chart';
import { Area, AreaChart } from 'recharts';

function BalanceCardSkeleton() {
  return (
    <div className='flex h-30 w-full flex-col gap-4'>
      <Skeleton className='h-6 w-1/2 rounded-full' />
      <Skeleton className='h-4 w-30 rounded-full' />
      <Skeleton className='h-8 w-40 rounded-full' />
    </div>
  );
}

// Mobile Version (minimised)
export function BalanceCardMobile() {
  const { data: userBalance } = useGetBalanceQuery();
  const {
    data: userDetails,
    isError,
    isLoading,
    error,
  } = useGetUserDetailsQuery();

  if (isLoading) return <BalanceCardSkeleton />;
  if (isError) return <h1>Oopsies! Error: {error.toString()}</h1>;

  return (
    <div className='flex min-h-30 w-full flex-col gap-4 text-[#f9f9f9]'>
      <h2 className='text-2xl font-semibold'>Hello, {userDetails?.name} 👋</h2>
      <div>
        <h4>Total Balance</h4>
        <h1 className='text-4xl font-semibold'>
          ${userBalance?.balance.toFixed(2)}
        </h1>
      </div>
    </div>
  );
}

// Desktop Version (expanded)
export function BalanceCard() {
  // TODO: Fetch actual balance data here
  const isMobile = useIsMobile();

  const { data: userBalance } = useGetBalanceQuery();
  const {
    data: userDetails,
    isError,
    isLoading,
    error,
  } = useGetUserDetailsQuery();

  if (isMobile) return null;
  if (isLoading) return <BalanceCardSkeleton />;
  if (isError) return <h1>Oopsies! Error: {error.toString()}</h1>;

  return (
    <div className='flex w-full flex-row items-center gap-4'>
      <div className='flex flex-col gap-4 text-nowrap'>
        <h2 className='text-2xl font-semibold'>
          Hello, {userDetails?.name} 👋
        </h2>
        <div>
          <h4>Total Balance</h4>
          <h1 className='text-4xl font-semibold'>
            ${userBalance?.balance.toFixed(2)}
          </h1>
        </div>
      </div>
      <BalanceCardGreeting />
    </div>
  );
}

function BalanceCardGreeting() {
  const {
    data: chartData,
    isLoading: chartIsLoading,
    error,
    isError,
  } = useGetTransactionStatsQuery({
    // startDate: startDate,
    // endDate: endDate,
    scope: 'month',
  });

  const chartConfig = {
    totalAmount: {
      label: 'Total',
    },
    date: {
      label: 'Date',
    },
  } satisfies ChartConfig;

  return (
    <div className='flex w-full flex-col gap-4'>
      <div className='flex w-full flex-col gap-4'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[70px] w-full'
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              bottom: 4,
            }}
          >
            <Area
              dataKey='totalAmount'
              type='basis'
              fill='url(#fill)'
              fillOpacity={0.1}
              stroke='var(--chart-1)'
            />
          </AreaChart>
        </ChartContainer>
      </div>
      {/* TODO: Put better name here */}
      <span className='text-muted-foreground text-sm'>
        Your balance increased by $100 from last month!
      </span>
    </div>
  );
}
