import { Search } from 'lucide-react';
import React from 'react';

export function PaginationSearch(
  props: React.InputHTMLAttributes<HTMLInputElement>,
) {
  return (
    <div className='bg-muted flex w-full flex-row items-center gap-2 rounded-xl px-2 py-1'>
      <Search className='text-muted-foreground size-5' />
      <input
        {...props}
        name='searchTerm'
        type='text'
        placeholder='Search'
        className='placeholder:text-muted-foreground w-full text-sm outline-0'
      />
    </div>
  );
}
