import { cn } from '@/utils/cn';
import { Search, X } from 'lucide-react';
import React from 'react';

export function PaginationSearch(
  props: React.InputHTMLAttributes<HTMLInputElement>,
) {
  const { value, onChange } = props;

  // Handler for clear button
  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onChange) {
      // Create a synthetic event to mimic input clearing
      const event = {
        ...e,
        target: { value: '' },
        currentTarget: { value: '' },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
    }
  };

  return (
    <div className='bg-muted/50 flex w-full flex-row items-center gap-2 rounded-xl p-2'>
      <Search className='text-muted-foreground size-5 shrink-0' />
      <input
        {...props}
        name='searchTerm'
        type='text'
        placeholder='Search'
        className='placeholder:text-muted-foreground w-full text-sm outline-0'
        aria-autocomplete='inline'
      />
      <button
        type='button'
        aria-label='Clear search'
        onClick={handleClear}
        className={cn(
          'transition-all transition-discrete duration-200 ease-in',
          value ? 'opacity-100' : 'hidden opacity-0',
        )}
      >
        <X className='text-muted-foreground size-4 shrink-0' />
      </button>
    </div>
  );
}
