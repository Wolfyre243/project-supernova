import React, { useState } from 'react';
import { Edit2, LucideIcon } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { IconMap } from '@/config/iconMap';
import { cn } from '@/utils/cn';

export function IconSelector({
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
          Edit Icon
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='mx-4 flex w-[92vw] rounded border p-2 shadow-lg md:w-80'>
        <div className='flex flex-row flex-wrap'>
          {Object.values(IconMap).map((iconItem: LucideIcon) => {
            return (
              <Button
                size={'icon'}
                variant={'ghost'}
                type='button'
                key={crypto.randomUUID()}
                onClick={() =>
                  iconItem.displayName &&
                  handleOptionClick(iconItem.displayName)
                }
              >
                {React.createElement(iconItem)}
              </Button>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
