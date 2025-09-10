import { Search } from 'lucide-react';

export function PaginationSearch() {
  return (
    <div className='bg-muted flex w-full flex-row items-center gap-2 rounded-xl border px-2 py-1'>
      <Search className='text-muted-foreground size-4' />
      <input
        name='searchTerm'
        type='text'
        placeholder='Search'
        className='placeholder:text-muted-foreground w-full text-sm outline-0'
      />
    </div>
  );
}
