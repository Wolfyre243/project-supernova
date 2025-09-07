'use client';

import { cn } from '@/utils/cn';
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks';
import {
  selectChartFilters,
  setRangeThisMonth,
  setRangeThisWeek,
  setRangeThisYear,
} from '@/app/state/chartFiltersSlice';

export function ScopeFilter() {
  const scope = useAppSelector(selectChartFilters).scope;
  const dispatch = useAppDispatch();

  return (
    <div className='bg-muted/10 flex flex-row gap-1 rounded-md'>
      <button
        className={cn(
          'hover:bg-muted/50 cursor-pointer rounded-md p-1 px-2.5 text-xs md:text-sm',
          scope === 'week' && 'bg-accent hover:bg-accent',
        )}
        onClick={() => {
          dispatch(setRangeThisWeek());
        }}
      >
        7D
      </button>
      <button
        className={cn(
          'hover:bg-muted/50 cursor-pointer rounded-md p-1 px-2.5 text-xs md:text-sm',
          scope === 'month' && 'bg-accent hover:bg-accent',
        )}
        onClick={() => {
          dispatch(setRangeThisMonth());
        }}
      >
        1M
      </button>
      <button
        className={cn(
          'hover:bg-muted/50 cursor-pointer rounded-md p-1 px-2.5 text-xs md:text-sm',
          scope === 'year' && 'bg-accent hover:bg-accent',
        )}
        onClick={() => {
          dispatch(setRangeThisYear());
        }}
      >
        1Y
      </button>
    </div>
  );
}
