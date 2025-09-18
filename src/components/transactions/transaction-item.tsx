import { IconMap } from '@/config/iconMap';
import { Transaction } from '@/lib/models';
import { cn } from '@/utils/cn';
import { Skeleton } from '../ui/skeleton';

export function TransactionItemSkeleton() {
  return (
    <div className='flex flex-row items-center justify-between'>
      <div className='flex flex-row items-center gap-4'>
        <Skeleton className='h-10 w-10 rounded-full' />
        <Skeleton className='h-4 w-32' />
      </div>
      <Skeleton className='h-4 w-16' />
    </div>
  );
}

export function TransactionItem({ transaction }: { transaction: Transaction }) {
  const isExpense = transaction.type === 'expense';

  return (
    <div className='flex flex-row items-center justify-between'>
      <div className='flex flex-row items-center gap-4'>
        <div
          className='h-fit w-fit rounded-full p-2'
          style={{ backgroundColor: transaction.categoryColor }}
        >
          {transaction.categoryIcon &&
            (() => {
              const SelectedIcon = IconMap[transaction.categoryIcon];
              return SelectedIcon ? <SelectedIcon className='size-5' /> : null;
            })()}
        </div>
        <h1 className='max-w-full truncate'>
          {transaction.notes?.trim() || transaction.categoryName}
        </h1>
      </div>
      <h2
        className={cn(
          isExpense ? 'text-red-400' : 'text-green-400',
          'font-bold',
        )}
      >
        {/* TODO: Fix transaction amount decimals */}
        {isExpense && '-'}${transaction.amount}
      </h2>
    </div>
  );
}
