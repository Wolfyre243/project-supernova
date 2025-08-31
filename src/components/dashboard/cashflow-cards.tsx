'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { Badge } from '../ui/badge';
import { cn } from '@/utils/cn';

export function IncomeCard({ className }: { className?: string }) {
  const isMobile = useIsMobile();

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
        {/* TODO: Add chart here */}
        <h1 className='mb-1 text-xl font-semibold text-green-500 md:text-2xl'>
          $4,200.00
        </h1>
        <div className='text-muted-foreground flex flex-row items-center gap-1'>
          <Badge className='rounded-full bg-green-500/10 text-green-500'>
            <TrendingUp /> 9.8%
          </Badge>
          {!isMobile && <span className='text-sm'>vs last month</span>}
        </div>
      </div>
    </div>
  );
}

export function ExpenseCard({ className }: { className?: string }) {
  const isMobile = useIsMobile();

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
        {/* TODO: Add chart here */}
        <h1 className='mb-1 text-xl font-semibold text-red-400 md:text-2xl'>
          $1,100.00
        </h1>
        <div className='text-muted-foreground flex flex-row items-center gap-1'>
          <Badge className='rounded-full bg-green-500/10 text-green-500'>
            <TrendingDown /> 9.8%
          </Badge>
          {!isMobile && <span className='text-sm'>vs last month</span>}
        </div>
      </div>
    </div>
  );
}
