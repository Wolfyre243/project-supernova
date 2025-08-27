'use client';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../ui/sidebar';

import { NavItem } from '@/config/navConfig';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Wallet,
  Receipt,
  ChartNoAxesColumnIncreasing,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { cn } from '@/utils/cn';

const iconMap: Record<string, React.ElementType> = {
  home: Home,
  wallet: Wallet,
  receipt: Receipt,
  chart: ChartNoAxesColumnIncreasing,
  settings: Settings,
  help: HelpCircle,
};

export function NavGroup({
  items,
  className,
}: {
  items: NavItem[];
  className?: string;
}) {
  const pathname = usePathname();

  // Find the longest matching main item
  let activeIndex = -1;
  let longestMatchLength = -1;
  items.forEach((item, idx) => {
    if (pathname === item.url || pathname.startsWith(item.url + '/')) {
      if (item.url.length > longestMatchLength) {
        activeIndex = idx;
        longestMatchLength = item.url.length;
      }
    }
  });

  return (
    <SidebarGroup className={cn('', className)}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item: NavItem, i) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={i === activeIndex}
              >
                <Link href={item.url}>
                  {(() => {
                    const Icon = iconMap[item.icon];
                    return Icon ? <Icon /> : null;
                  })()}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function NavGroupSecondary({
  items,
  className,
}: {
  items: NavItem[];
  className?: string;
}) {
  return (
    <SidebarGroup className={cn('', className)}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item: NavItem, i) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                className='hover:text-foreground text-muted-foreground hover:bg-transparent dark:hover:bg-transparent'
              >
                <Link href={item.url}>
                  {(() => {
                    const Icon = iconMap[item.icon];
                    return Icon ? <Icon /> : null;
                  })()}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
