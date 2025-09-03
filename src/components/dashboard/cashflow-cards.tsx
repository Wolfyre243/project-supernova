'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import { Loader2, TrendingDown, TrendingUp } from 'lucide-react';
import { Badge } from '../ui/badge';
import { cn } from '@/utils/cn';
import {
  useGetExpenseTotalQuery,
  useGetIncomeTotalQuery,
  useGetTransactionStatsByDateQuery,
} from '@/app/state/transaction/transactionsApi';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '../ui/chart';
import { Area, AreaChart } from 'recharts';

export function IncomeCard({ className }: { className?: string }) {
  const isMobile = useIsMobile();

  const { data } = useGetIncomeTotalQuery('month');

  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const { data: chartData, isLoading: chartIsLoading } =
    useGetTransactionStatsByDateQuery({
      type: 'income',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

  const chartConfig = {
    totalAmount: {
      label: 'Total',
    },
    date: {
      label: 'Income',
    },
    transactionCount: {
      label: 'Transaction Count',
    },
  } satisfies ChartConfig;

  return (
    <div
      className={cn(
        'bg-card flex w-full min-w-1/5 flex-col rounded-2xl border p-4 md:max-w-1/4',
        className,
      )}
    >
      <div className='mb-2 flex flex-row items-center justify-between overflow-hidden'>
        <h1 className='text-muted-foreground text-sm text-nowrap'>
          Monthly Income
        </h1>
        {/* <ExternalLink className='size-4' /> */}
      </div>
      <div>
        <div className='flex flex-col'>
          {chartIsLoading && !isMobile && (
            <div className='text-muted flex h-full flex-row items-center justify-center gap-2'>
              <Loader2 className='animate-spin' />
              <span>Loading chart...</span>
            </div>
          )}
          {chartData && !isMobile && (
            <ChartContainer config={chartConfig} className='h-10 w-full'>
              <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                  bottom: 10,
                }}
              >
                <Area
                  dataKey='totalAmount'
                  type='natural'
                  fill='url(#fillIncome)'
                  fillOpacity={0.1}
                  stroke='var(--color-green-500)'
                  stackId='a'
                />
                <ChartTooltip
                  cursor={false}
                  includeHidden
                  content={<ChartTooltipContent />}
                />
              </AreaChart>
            </ChartContainer>
          )}
        </div>

        <h1 className='mb-1 text-xl font-semibold text-green-500 md:text-2xl'>
          ${data?.totalIncome.toFixed(2) ?? '...'}
        </h1>
        <div className='text-muted-foreground flex flex-row items-center gap-1'>
          {data && data?.incomeDifference >= 0 ? (
            <Badge className='rounded-full bg-green-500/10 text-green-500'>
              <TrendingUp /> {Math.abs(data.incomeDifference).toFixed(1)}%
            </Badge>
          ) : (
            <Badge className='rounded-full bg-red-500/10 text-red-500'>
              <TrendingDown />{' '}
              {Math.abs(data?.incomeDifference || 0).toFixed(1)}%
            </Badge>
          )}
          {!isMobile && <span className='text-sm'>vs last month</span>}
        </div>
      </div>
    </div>
  );
}

export function ExpenseCard({ className }: { className?: string }) {
  const isMobile = useIsMobile();

  const { data } = useGetExpenseTotalQuery('month');

  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const { data: chartData, isLoading: chartIsLoading } =
    useGetTransactionStatsByDateQuery({
      type: 'expense',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

  const chartConfig = {
    totalAmount: {
      label: 'Total',
    },
    date: {
      label: 'Expense',
    },
    transactionCount: {
      label: 'Transaction Count',
    },
  } satisfies ChartConfig;

  return (
    <div
      className={cn(
        'bg-card flex w-full min-w-1/5 flex-col rounded-2xl border p-4 md:max-w-1/4',
        className,
      )}
    >
      <div className='mb-2 flex flex-row items-center justify-between overflow-hidden'>
        <h1 className='text-muted-foreground text-sm text-nowrap'>
          Monthly Expenses
        </h1>
        {/* <ExternalLink className='size-4' /> */}
      </div>
      <div>
        <div className='flex flex-col'>
          {chartIsLoading && !isMobile && (
            <div className='text-muted flex h-full flex-row items-center justify-center gap-2'>
              <Loader2 className='animate-spin' />
              <span>Loading chart...</span>
            </div>
          )}
          {chartData && !isMobile && (
            <ChartContainer config={chartConfig} className='h-10 w-full'>
              <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                  bottom: 10,
                }}
              >
                <Area
                  dataKey='totalAmount'
                  type='natural'
                  fill='url(#fillIncome)'
                  fillOpacity={0.1}
                  stroke='var(--color-red-500)'
                  stackId='a'
                />
                <ChartTooltip
                  cursor={false}
                  includeHidden
                  content={<ChartTooltipContent />}
                />
              </AreaChart>
            </ChartContainer>
          )}
        </div>
        <h1 className='mb-1 text-xl font-semibold text-red-400 md:text-2xl'>
          ${data?.totalExpense.toFixed(2) ?? '...'}
        </h1>
        <div className='text-muted-foreground flex flex-row items-center gap-1'>
          {data && data?.expenseDifference >= 0 ? (
            <Badge className='rounded-full bg-red-500/10 text-red-500'>
              <TrendingUp /> {Math.abs(data.expenseDifference).toFixed(1)}%
            </Badge>
          ) : (
            <Badge className='rounded-full bg-green-500/10 text-green-500'>
              <TrendingDown />{' '}
              {Math.abs(data?.expenseDifference || 0).toFixed(1)}%
            </Badge>
          )}
          {!isMobile && <span className='text-sm'>vs last month</span>}
        </div>
      </div>
    </div>
  );
}
