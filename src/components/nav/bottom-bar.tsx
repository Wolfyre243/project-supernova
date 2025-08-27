'use client';

import { mobileNavItems, NavIconItem } from '@/config/navConfig';
import { cn } from '@/utils/cn';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function BottomBarItem({
  item,
  active = false,
}: {
  item: NavIconItem;
  active?: boolean;
}) {
  return (
    <Link
      href={item.url}
      className={cn(
        'flex h-fit flex-col items-center gap-1',
        active && 'text-secondary',
      )}
    >
      <item.icon />
      <p className='text-center text-xs'>{item.title}</p>
    </Link>
  );
}

export default function BottomBar() {
  const pathname = usePathname();
  const items: NavIconItem[] = mobileNavItems;

  return (
    <nav className='border-muted/50 bg-background flex w-full flex-row items-end justify-evenly border-t py-3'>
      {items.slice(0, Math.floor(items.length / 2)).map((item: NavIconItem) => {
        const isActive = pathname.startsWith(item.url);
        return (
          <BottomBarItem
            item={item}
            active={isActive}
            key={crypto.randomUUID()}
          />
        );
      })}
      <button className='bg-homepage-gradient h-fit w-fit rounded-full p-2'>
        <Plus className='size-9 text-[#f9f9f9]' />
      </button>
      {items
        .slice(Math.floor(items.length / 2), items.length)
        .map((item: NavIconItem) => {
          const isActive = pathname.startsWith(item.url);
          return (
            <BottomBarItem
              item={item}
              active={isActive}
              key={crypto.randomUUID()}
            />
          );
        })}
    </nav>
  );
}
