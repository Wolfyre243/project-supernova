'use client';

import { Account } from '@/lib/models';
import { cn } from '@/utils/cn';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useGetAccountsQuery } from '@/app/state/account/accountsApi';
import { Skeleton } from './ui/skeleton';
import { toast } from 'sonner';
import { IconMap } from '@/config/iconMap';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { NewAccountForm } from './dashboard/new-account-dialog';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<Partial<Account> | undefined>(
    undefined,
  );

  const { data, isLoading, isError, error } = useGetAccountsQuery();

  useEffect(() => {
    if (data && data.length > 0 && data[0].accountId) {
      setSelected(data[0]);
      onValueChange(data[0].accountId);
    }
  }, [data, onValueChange]);

  const handleOptionClick = (option: Partial<Account>) => {
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
            'flex max-w-full items-center justify-between gap-1 py-2 transition-all duration-200 focus:outline-none',
            className,
          )}
        >
          <div className='flex flex-row items-center gap-4'>
            <div
              className='text-card flex items-center justify-center rounded-full p-2.5'
              style={{ backgroundColor: selected?.color || '#f9f9f9' }}
            >
              {selected?.icon &&
                (() => {
                  const SelectedIcon = IconMap[selected.icon];
                  return SelectedIcon ? <SelectedIcon /> : null;
                })()}
            </div>
            <span className='max-w-36 truncate text-xl'>
              {selected?.name ?? 'Select'}
            </span>
          </div>
          <ChevronDown
            className={`h-5 w-5 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          />
        </div>
      </DropdownMenuTrigger>

      {/* TODO: Implement search (low priority because limit is 3 accoutns anyway) */}
      <DropdownMenuContent className='max-h-[25vh] w-76 overflow-y-scroll'>
        {data &&
          data.length > 0 &&
          data.map((accountOption: Partial<Account>) => (
            <DropdownMenuItem
              key={accountOption.accountId}
              onClick={() => handleOptionClick(accountOption)}
              className='flex items-center gap-2'
            >
              <div
                className='flex flex-row items-center justify-center rounded-full p-2'
                style={{ backgroundColor: accountOption.color || '#f9f9f9' }}
              >
                {accountOption?.icon &&
                  (() => {
                    const SelectedIcon = IconMap[accountOption.icon];
                    return SelectedIcon ? (
                      <SelectedIcon className='text-card size-4' />
                    ) : null;
                  })()}
              </div>
              <span className='max-w-56 truncate'>{accountOption.name}</span>
            </DropdownMenuItem>
          ))}
        {data && data.length === 0 && !isLoading && (
          <DropdownMenuItem disabled>No accounts found</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
