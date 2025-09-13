'use client';

import { Category } from '@/lib/models';
import { ColorOptions } from '@/config/colorOptions';
import { useGetSingleAccountQuery } from '@/app/state/account/accountsApi';
import { Loader2 } from 'lucide-react';

// Horizontal Bar Chart for Category Distribution
// TODO: Refactor into pie chart for now
function CategoryDistributionChart({
  data,
}: {
  data: (Partial<Category> & { count: number })[];
}) {
  if (!data || data.length === 0) {
    return (
      <div className='text-muted-foreground text-sm'>No data available.</div>
    );
  }

  // Calculate total count for proportional widths
  const total = data.reduce((sum, c) => sum + (c.count || 0), 0) || 1;

  // Assign color: use category.color if present, else fallback to palette
  const getColor = (cat: Partial<Category>, idx: number) =>
    cat.color && typeof cat.color === 'string' && cat.color.length > 0
      ? cat.color
      : ColorOptions[idx % ColorOptions.length];

  return (
    <div className='flex flex-col gap-2'>
      {/* Horizontal Distribution Bar */}
      <div
        className='border-muted flex h-6 w-full overflow-hidden rounded border'
        aria-label='Category distribution'
        role='img'
      >
        {data &&
          data.map((cat, idx) => (
            <div
              key={cat.categoryId || cat.name || idx}
              style={{
                width: `${((cat.count || 0) / total) * 100}%`,
                backgroundColor: getColor(cat, idx),
                transition: 'width 0.3s',
              }}
              className='h-full'
              aria-label={`${cat.name}: ${cat.count}`}
              title={`${cat.name || 'Unknown'}: ${cat.count}`}
            />
          ))}
      </div>
      {/* Legend */}
      <div className='flex flex-wrap gap-2'>
        {data &&
          data.map((cat, idx) => (
            <div
              key={cat.categoryId || cat.name || idx}
              className='flex items-center gap-1 text-xs'
            >
              <span
                className='border-muted inline-block h-3 w-3 rounded-sm border'
                style={{ backgroundColor: getColor(cat, idx) }}
                aria-hidden='true'
              />
              <span className='text-muted-foreground'>
                {cat.name || 'Unknown'}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className='text-muted flex flex-col items-center gap-2 p-4'>
      <Loader2 className='animate-spin' />
      <span className='text-sm'>Loading data...</span>
    </div>
  );
}

export function AccountIncomeStatCard({ accountId }: { accountId: string }) {
  const { data: accountData, isLoading } = useGetSingleAccountQuery(accountId);

  if (isLoading) return <StatCardSkeleton />;

  return (
    <div className='flex flex-col gap-2 p-4'>
      <h1 className='text-xl font-semibold'>
        ${accountData?.income?.total.toFixed(2)}
      </h1>
      <CategoryDistributionChart
        data={accountData?.income?.categoryDistribution ?? []}
      />
    </div>
  );
}

export function AccountExpenseStatCard({ accountId }: { accountId: string }) {
  const { data: accountData, isLoading } = useGetSingleAccountQuery(accountId);

  if (isLoading) return <StatCardSkeleton />;

  return (
    <div className='flex flex-col gap-2 p-4'>
      <h1 className='text-xl font-semibold'>
        ${accountData?.expense?.total.toFixed(2)}
      </h1>
      <CategoryDistributionChart
        data={accountData?.expense?.categoryDistribution ?? []}
      />
    </div>
  );
}
