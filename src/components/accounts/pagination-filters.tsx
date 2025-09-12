import {
  ArrowUpDown,
  BanknoteArrowDown,
  BanknoteArrowUp,
  ClockArrowDown,
  ClockArrowUp,
} from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export function AccountPaginationSortBy({
  value,
  onValueChange,
}: {
  value: string;
  onValueChange: (v: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={'ghost'} size={'icon'}>
          <ArrowUpDown className='size-5' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-46' align='end'>
        <DropdownMenuLabel>Sort By</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={value} onValueChange={onValueChange}>
          <DropdownMenuRadioItem value='total,desc'>
            Total
            <BanknoteArrowDown />
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value='total,asc'>
            Total
            <BanknoteArrowUp />
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value='createdAt,desc'>
            Created At
            <ClockArrowDown />
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value='createdAt,asc'>
            Created At
            <ClockArrowUp />
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
