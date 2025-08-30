'use client';

import { Account } from '@/lib/models';
import { cn } from '@/utils/cn';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, DollarSign } from 'lucide-react';
import { useEffect, useState } from 'react';

const dummyData: Partial<Account>[] = [
  {
    accountId: 'abscdef123jnjw1',
    name: 'Debit Card',
    icon: 'DollarSign',
  },
  {
    accountId: 'absqwdqwdqdnjw1',
    name: 'Cash',
    icon: 'DollarSign',
  },
];

export function AccountSelector({
  onValueChange,
  className,
}: {
  onValueChange: (value: string) => void;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<Partial<Account>>(dummyData[0]);

  useEffect(() => {
    if (dummyData[0]?.accountId) {
      onValueChange(dummyData[0].accountId);
    }
  }, [onValueChange]);

  const handleOptionClick = (option: Partial<Account>) => {
    setSelected(option);
    onValueChange(option.accountId as string);
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
            <span className='text-xl'>{selected.name}</span>
          </div>
          <ChevronDown
            className={`h-5 w-5 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          />
        </div>
      </DropdownMenuTrigger>

      {/* TODO: Fetch available options from db */}
      <DropdownMenuContent className='w-76'>
        {dummyData.map((accountOption: Partial<Account>) => {
          return (
            <DropdownMenuItem
              key={crypto.randomUUID()}
              onClick={() => handleOptionClick(accountOption)}
              className='flex items-center gap-2'
            >
              <div className='bg-background flex flex-row items-center justify-center rounded-full p-2'>
                <DollarSign className='size-4' />
              </div>
              <span>{accountOption.name}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
