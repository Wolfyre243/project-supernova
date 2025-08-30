'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, DollarSign } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Category } from '@/lib/models';
import { cn } from '@/utils/cn';
import { useGetCategoriesByTypeQuery } from '@/app/state/category/categoriesApiSlice';
import { Skeleton } from './ui/skeleton';
import { toast } from 'sonner';

function CategorySelectSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex w-full items-center justify-between gap-4 py-2 transition-all duration-200 focus:outline-none',
        className,
      )}
    >
      <div className='flex flex-row items-center gap-4'>
        <Skeleton className='h-10 w-10 rounded-full' />
        <Skeleton className='h-4 w-28 rounded-full' />
      </div>
      <ChevronDown className={`h-5 w-5`} />
    </div>
  );
}

export function CategorySelector({
  onValueChange,
  transactionType,
  className,
}: {
  onValueChange: (value: string) => void;
  transactionType: 'income' | 'expense';
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<Category | undefined>(undefined);

  const { data, isError, isLoading, error } =
    useGetCategoriesByTypeQuery(transactionType);

  // Ensure parent receives the initial value on mount
  useEffect(() => {
    if (data && data[0]?.categoryId) {
      setSelected(data[0]);
      onValueChange(data[0].categoryId);
    }
  }, [onValueChange, data, isLoading]);

  const handleOptionClick = (option: Category) => {
    setSelected(option);
    onValueChange(option.categoryId as string);
    setIsOpen(false);
  };

  if (isLoading) {
    return <CategorySelectSkeleton />;
  }

  if (isError) {
    console.error(error);
    toast.error('Error loading categories');
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <div
          className={cn(
            'flex w-full items-center justify-between gap-4 py-2 transition-all duration-200 focus:outline-none',
            className,
          )}
        >
          <div className='flex flex-row items-center gap-4'>
            <div className='bg-accent flex items-center justify-center rounded-full p-2'>
              <DollarSign />
            </div>
            <span className='text-xl'>{selected?.name ?? 'Select'}</span>
          </div>
          <ChevronDown
            className={`h-5 w-5 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          />
        </div>
      </DropdownMenuTrigger>

      {/* TODO: Fetch available options from db */}
      <DropdownMenuContent className='w-76'>
        {data && data.length > 0
          ? data.map((categoryOption: Category) => {
              return (
                <DropdownMenuItem
                  key={crypto.randomUUID()}
                  onClick={() => handleOptionClick(categoryOption)}
                  className='flex items-center gap-2'
                >
                  <div className='bg-background flex flex-row items-center justify-center rounded-full p-2'>
                    <DollarSign className='size-4' />
                  </div>
                  <span>{categoryOption.name}</span>
                </DropdownMenuItem>
              );
            })
          : ''}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
