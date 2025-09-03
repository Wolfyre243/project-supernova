'use client';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Plus, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/utils/cn';
import { useState } from 'react';

export function NewAccountButton() {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size={'icon'} variant={'ghost'}>
          <Plus className='size-5' />
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          isMobile &&
            'h-screen max-h-screen max-w-screen min-w-screen rounded-none',
          'flex flex-col',
          '[&>button:last-child]:hidden',
        )}
      >
        <DialogTitle className='flex h-fit flex-row justify-between'>
          <h1>Add Account</h1>
          <Button
            size={'icon'}
            variant={'ghost'}
            className='h-fit w-fit outline-0 hover:bg-none dark:hover:bg-transparent'
            onClick={() => setIsOpen(false)}
          >
            <X className='size-5' />
          </Button>
        </DialogTitle>
        <div className='flex h-full flex-col'>
          <span>this is a test</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
