'use client';

import { useGetTransactionStatsQuery } from '@/app/state/transaction/transactionsApi';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '../ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { useLocale } from '@/hooks/useLocale';
import { useAppSelector } from '@/hooks/redux-hooks';
import { selectChartFilters } from '@/app/state/chartFiltersSlice';
import { CircleX, Loader2 } from 'lucide-react';

export function TransactionChart() {
  const isMobile = useIsMobile();
  const userLocale = useLocale();

  const scope = useAppSelector(selectChartFilters).scope;

  const {
    data: chartData,
    isLoading: chartIsLoading,
    error,
    isError,
  } = useGetTransactionStatsQuery({
    // startDate: startDate,
    // endDate: endDate,
    scope,
  });

  // TODO: Include more comprehensive data
  const chartConfig = {
    totalAmount: {
      label: 'Total',
    },
    date: {
      label: 'Date',
    },
    transactionCount: {
      label: 'Transactions',
    },
  } satisfies ChartConfig;

  if (chartIsLoading) {
    return (
      <div className='flex aspect-auto h-[200px] w-full flex-col items-center justify-center gap-2 md:h-[300px]'>
        <Loader2 className='text-muted animate-spin' />
        <span className='text-muted animate-pulse'>
          Hang tight, we&apos;re getting your data ready...
        </span>
      </div>
    );
  }

  if (isError) {
    console.error(error);
    return (
      <div className='flex aspect-auto h-[200px] w-full flex-col items-center justify-center gap-2 md:h-[300px]'>
        <CircleX className='text-muted' />
        <span className='text-muted'>
          Oops! An error occured while processing your data...
        </span>
      </div>
    );
  }

  return (
    <ChartContainer
      config={chartConfig}
      className='aspect-auto h-[200px] w-full md:h-[300px]'
    >
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          top: 12,
          right: 30,
          left: 4,
        }}
      >
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis
          dataKey='date'
          tickLine={false}
          tickMargin={10}
          minTickGap={12}
          axisLine={true}
          tickFormatter={(value) => {
            if (scope === 'month') {
              const date = new Date(value);
              return date.toLocaleDateString(userLocale, {
                month: 'short',
                day: 'numeric',
              });
            } else if (scope === 'week') {
              const date = new Date(value);
              const day = date.toLocaleDateString(userLocale, {
                weekday: 'long',
              });
              return isMobile ? day.slice(0, 3) : day;
            }
            return value;
          }}
        />
        <YAxis
          tickLine={true}
          axisLine={true}
          tickMargin={10}
          allowDecimals={false}
          tickFormatter={(value) => {
            return `$${value}`;
          }}
        />
        <defs>
          <linearGradient id='fill' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='5%' stopColor='var(--chart-1)' stopOpacity={0.8} />
            <stop offset='95%' stopColor='var(--chart-1)' stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <ChartTooltip
          includeHidden
          content={
            <ChartTooltipContent
              formatter={(value, name, item, index) => (
                <>
                  {chartConfig[name as keyof typeof chartConfig]?.label || name}
                  <div className='text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums'>
                    {index === 0 && '$'}
                    {value}
                  </div>
                </>
              )}
            />
          }
        />
        <Area
          dataKey='totalAmount'
          type='bump'
          fill='url(#fill)'
          fillOpacity={0.1}
          stroke='var(--chart-1)'
        />
        <Area
          dataKey='transactionCount'
          hide
          type='natural'
          fill='url(#fill)'
          fillOpacity={0.1}
          stroke='var(--chart-1)'
        />
      </AreaChart>
    </ChartContainer>
  );
}
