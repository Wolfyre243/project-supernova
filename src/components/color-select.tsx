import React, { useState } from 'react';
import { Brush, Edit2, LucideIcon } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { cn } from '@/utils/cn';
import { ColorOptions } from '@/config/colorOptions';

export function ColorSelector({
  onValueChange,
  className,
}: {
  onValueChange: (value: string) => void;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string | undefined>(undefined);

  const handleOptionClick = (option: string) => {
    setSelected(option);
    onValueChange(option);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant={'ghost'} type='button' className={cn('', className)}>
          <Edit2 />
          Edit Color
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='mx-4 flex w-[92vw] rounded border p-2 shadow-lg'
        align='end'
      >
        <div className='flex flex-row flex-wrap'>
          {ColorOptions.map((hexColor: string) => {
            return (
              <Button
                size={'icon'}
                variant={'ghost'}
                type='button'
                key={crypto.randomUUID()}
                onClick={() => handleOptionClick(hexColor)}
              >
                <div
                  className='h-8 w-8 rounded-full'
                  style={{ backgroundColor: hexColor }}
                />
              </Button>
            );
          })}
          {/* TODO: Custom color picker, PREMIUM only */}
          {/* <Button
            size={'icon'}
            variant={'ghost'}
            type='button'
            key={crypto.randomUUID()}
            // onClick={() => handleOptionClick(hexColor)}
          >
            <div className='rainbow-gradient h-8 w-8 rounded-full p-0.5'>
              <div className='bg-background flex h-full w-full flex-row items-center justify-center rounded-full'>
                <Brush />
              </div>
            </div>
          </Button> */}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
