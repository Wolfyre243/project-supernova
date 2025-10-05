'use client';

import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Check, Filter, LayoutGrid, Plus, PlusCircle, X } from 'lucide-react';
import { Button } from '../ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../ui/drawer';
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks';
import {
  addCategoryId,
  clearCategoryIds,
  selectTransactionFilters,
  setTransactionType,
} from '@/app/state/transaction/transactionFiltersSlice';
import { cn } from '@/utils/cn';
import { useGetCategoriesQuery } from '@/app/state/category/categoriesApi';
import { Skeleton } from '../ui/skeleton';
import { Category } from '@/lib/models';
import { IconMap } from '@/config/iconMap';

const snapPoints = [0.65];

function TransactionsTypeFilter() {
  const dispatch = useAppDispatch();
  const { type } = useAppSelector(selectTransactionFilters);

  return (
    <div className='flex flex-col gap-2'>
      <h1 className='text-muted sr-only font-semibold'>Transaction Type</h1>
      <div className='flex flex-row gap-2'>
        <Button
          size={'sm'}
          variant={'outline'}
          className={cn(
            'border-2 !border-green-500/20',
            type === 'income'
              ? '!border-green-500/50'
              : 'text-muted-foreground',
          )}
          onClick={() => dispatch(setTransactionType('income'))}
        >
          {type === 'income' && <Check />}
          Income
        </Button>
        <Button
          size={'sm'}
          variant={'outline'}
          className={cn(
            'border-2 !border-red-500/20',
            type === 'expense' ? '!border-red-500/50' : 'text-muted-foreground',
          )}
          onClick={() => dispatch(setTransactionType('expense'))}
        >
          {type === 'expense' && <Check />}
          Expense
        </Button>
      </div>
    </div>
  );
}

function TransactionsCategoryFilter() {
  const dispatch = useAppDispatch();
  const { categoryIds } = useAppSelector(selectTransactionFilters);

  const { data, isLoading } = useGetCategoriesQuery();

  return (
    <div className='flex flex-col gap-2'>
      <h1 className='text-muted sr-only font-semibold'>Category</h1>
      <div className='scrollbar-none flex flex-row justify-start gap-2 overflow-x-scroll'>
        {isLoading &&
          Array.from({ length: 5 }).map(() => (
            <div
              className='flex flex-col items-center gap-2'
              key={crypto.randomUUID()}
            >
              <Skeleton className='h-14 w-14 rounded-2xl' />
              <Skeleton className='h-2 w-12' />
            </div>
          ))}
        {data && (
          <button
            className='flex flex-col gap-1'
            onClick={() => dispatch(clearCategoryIds())}
          >
            <div
              className={cn(
                'bg-muted flex h-14 w-14 items-center justify-center rounded-2xl',
                categoryIds?.length === 0 && 'border-primary/70 border-2',
              )}
            >
              <LayoutGrid />
            </div>
            <span className='text-muted-foreground text-center text-xs'>
              All
            </span>
          </button>
        )}
        {data &&
          data.map((category: Category) => {
            const isSelected = Boolean(
              categoryIds?.includes(category.categoryId),
            );
            return (
              <button
                className='flex flex-col gap-1'
                onClick={() => dispatch(addCategoryId(category.categoryId))}
                key={crypto.randomUUID()}
              >
                <div
                  className={cn(
                    'flex h-14 w-14 items-center justify-center rounded-2xl',
                    isSelected && 'border-primary/70 border-2',
                  )}
                  style={{ backgroundColor: category.color }}
                >
                  {category.icon &&
                    (() => {
                      const SelectedIcon = IconMap[category.icon];
                      return SelectedIcon ? <SelectedIcon /> : null;
                    })()}
                </div>
                <span className='text-muted-foreground text-center text-xs'>
                  {category.name}
                </span>
              </button>
            );
          })}
        {/* TODO: Add functionality to create category from here */}
        {data && (
          <div className='flex flex-col gap-1'>
            <div className='flex h-14 w-14 items-center justify-center rounded-2xl'>
              <PlusCircle className='text-muted-foreground' />
            </div>
            {/* <span className='text-center text-xs text-muted-foreground'>New</span> */}
          </div>
        )}
      </div>
    </div>
  );
}

export function TransactionCategoryFilterArray() {
  const dispatch = useAppDispatch();
  const { categoryIds } = useAppSelector(selectTransactionFilters);

  const { data } = useGetCategoriesQuery();

  return (
    <div className='flex flex-row gap-2'>
      {data &&
        data.map((category: Category) => {
          const isSelected = Boolean(
            categoryIds?.includes(category.categoryId),
          );
          if (isSelected) {
            return (
              <Button
                size={'sm'}
                variant={'outline'}
                style={{ borderColor: category.color, borderWidth: 2 }}
                onClick={() => dispatch(addCategoryId(category.categoryId))}
                key={crypto.randomUUID()}
              >
                {category.name}
                <X />
              </Button>
            );
          }
        })}
    </div>
  );
}

export function TransactionsFilterMenu() {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [snap, setSnap] = useState<number | string | null>(snapPoints[0]);

  // Use drawer if mobile
  if (isMobile) {
    return (
      <Drawer
        open={isOpen}
        onOpenChange={setIsOpen}
        snapPoints={snapPoints}
        activeSnapPoint={snap}
        setActiveSnapPoint={setSnap}
        snapToSequentialPoint
        fadeFromIndex={0}
        modal={true}
      >
        <DrawerTrigger asChild>
          <Button variant={'ghost'} size={'icon'}>
            <Filter />
          </Button>
        </DrawerTrigger>
        <DrawerContent className='h-full max-h-[97%] w-full px-4 pb-4'>
          <DrawerHeader className='px-0'>
            <DrawerTitle className='text-left text-3xl'>Filters</DrawerTitle>
          </DrawerHeader>
          <DrawerDescription className='sr-only'>
            Configure transaction filters to search
          </DrawerDescription>
          <div className='flex h-full flex-col gap-4'>
            <TransactionsTypeFilter />
            <TransactionsCategoryFilter />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  // TODO: Add desktop version as dropdown
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant={'ghost'} size={'icon'}>
          <Filter />
        </Button>
      </PopoverTrigger>
      <PopoverContent>Place content for the popover here.</PopoverContent>
    </Popover>
  );
}
