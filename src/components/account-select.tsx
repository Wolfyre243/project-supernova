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
import { useGetAccountsQuery } from '@/app/state/account/accountsApiSlice';
import { Skeleton } from './ui/skeleton';
import { toast } from 'sonner';

function AccountSelectSkeleton({ className }: { className?: string }) {
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

export function AccountSelector({
  onValueChange,
  className,
}: {
  onValueChange: (value: string) => void;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<Account | undefined>(undefined);

  const { data, isLoading, isError, error } = useGetAccountsQuery();

  useEffect(() => {
    if (data && data.length > 0 && data[0].accountId) {
      setSelected(data[0]);
      onValueChange(data[0].accountId);
    }
  }, [data, onValueChange]);

  const handleOptionClick = (option: Account) => {
    setSelected(option);
    onValueChange(option.accountId as string);
    setIsOpen(false);
  };

  if (isLoading) {
    return <AccountSelectSkeleton />;
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
            'flex max-w-full items-center justify-between gap-4 py-2 transition-all duration-200 focus:outline-none',
            className,
          )}
        >
          <div className='flex flex-row items-center gap-4'>
            <div className='bg-accent flex items-center justify-center rounded-full p-2'>
              <DollarSign />
            </div>
            <span className='max-w-42 truncate text-xl'>
              {selected?.name ?? 'Select'}
            </span>
          </div>
          <ChevronDown
            className={`h-5 w-5 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='w-76'>
        {data &&
          data.length > 0 &&
          data.map((accountOption: Account) => (
            <DropdownMenuItem
              key={accountOption.accountId}
              onClick={() => handleOptionClick(accountOption)}
              className='flex items-center gap-2'
            >
              <div className='bg-background flex flex-row items-center justify-center rounded-full p-2'>
                <DollarSign className='size-4' />
              </div>
              <span>{accountOption.name}</span>
            </DropdownMenuItem>
          ))}
        {data && data.length === 0 && !isLoading && (
          <DropdownMenuItem disabled>No accounts found</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
