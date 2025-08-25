'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { NavItem, navItems } from '@/config/navConfig';
import { Sparkle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function NavGroup({ items }: { items: NavItem[] }) {
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
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {navItems.map((item: NavItem, i) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={i === activeIndex}
              >
                <Link href={item.url}>
                  <item.icon />
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

export function AppSidebar() {
  return (
    <Sidebar variant='sidebar' collapsible='icon'>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className='flex flex-row items-center gap-2 p-1'>
              <div className='flex aspect-square size-8 items-center justify-center rounded-lg'>
                {/* TODO: Replace with logo */}
                <Sparkle />
              </div>
              <div className='flex flex-col text-left text-lg leading-tight'>
                <h1 className='font-medium'>Nova</h1>
                <span className='text-xs text-muted-foreground/50'>
                  Track your finance
                </span>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Main Navigation */}
        <NavGroup items={navItems} />
        <SidebarSeparator />
      </SidebarContent>
      <SidebarFooter>
        {/* TODO: Put Premium Ad here, or free trial card, etc */}
        {/* <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>Logout</SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu> */}
      </SidebarFooter>
    </Sidebar>
  );
}
