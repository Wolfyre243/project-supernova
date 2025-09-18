'use client';

import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Filter } from 'lucide-react';
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

const snapPoints = [0.7, 1];

// This component is intended for mobile only.
export function TransactionsFilterMenu() {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [snap, setSnap] = useState<number | string | null>(snapPoints[0]);

  if (isMobile) {
    return (
      <Drawer
        open={isOpen}
        onOpenChange={setIsOpen}
        snapPoints={snapPoints}
        activeSnapPoint={snap}
        setActiveSnapPoint={setSnap}
        fadeFromIndex={0}
        modal={true}
      >
        <DrawerTrigger asChild>
          <Button variant={'ghost'} size={'icon'}>
            <Filter />
          </Button>
        </DrawerTrigger>
        <DrawerContent className='h-full max-h-[97%] w-full'>
          <DrawerHeader>
            <DrawerTitle>Filters</DrawerTitle>
          </DrawerHeader>
          <DrawerDescription className='sr-only'>
            Configure transaction filters to search
          </DrawerDescription>
          <div>
            <h1>sum ting wong</h1>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

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
