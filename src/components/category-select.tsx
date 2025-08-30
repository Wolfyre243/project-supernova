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

const dummyDataIncome: Partial<Category>[] = [
  {
    categoryId: 'abscdef123jnjw1',
    name: 'Salary',
    icon: 'DollarSign',
  },
  {
    categoryId: 'absqwdqwdqdnjw1',
    name: 'Gigs',
    icon: 'DollarSign',
  },
];
const dummyDataExpenses: Partial<Category>[] = [
  {
    categoryId: 'a223rweeewfwf',
    name: 'Food',
    icon: 'DollarSign',
  },
  {
    categoryId: 'wefwefwef',
    name: 'Clothes',
    icon: 'DollarSign',
  },
];

export function CategorySelector({
  onValueChange,
  transactionType,
  className,
}: {
  onValueChange: (value: string) => void;
  transactionType: 'income' | 'expense';
  className?: string;
}) {
  const [categoryList, setCategoryList] = useState<Partial<Category>[]>([]);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<Partial<Category> | undefined>(
    undefined,
  );

  // Ensure parent receives the initial value on mount
  useEffect(() => {
    if (transactionType === 'income') {
      setCategoryList(dummyDataIncome);
    } else {
      setCategoryList(dummyDataExpenses);
    }
    if (categoryList[0]?.categoryId) {
      setSelected(categoryList[0]);
      onValueChange(categoryList[0].categoryId);
    } else {
      setSelected(undefined);
    }
  }, [onValueChange, transactionType, categoryList]);

  const handleOptionClick = (option: Partial<Category>) => {
    setSelected(option);
    onValueChange(option.categoryId as string);
    setIsOpen(false);
  };

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
            <span className='text-xl'>
              {selected?.name ?? 'Select category'}
            </span>
          </div>
          <ChevronDown
            className={`h-5 w-5 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          />
        </div>
      </DropdownMenuTrigger>

      {/* TODO: Fetch available options from db */}
      <DropdownMenuContent className='w-76'>
        {categoryList.length > 0
          ? categoryList.map((categoryOption: Partial<Category>) => {
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
