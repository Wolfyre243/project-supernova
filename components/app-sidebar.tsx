'use client';

import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { NavItem, navItems } from '@/config/navConfig';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';

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
  const { state } = useSidebar();

  return (
    <Sidebar variant='sidebar' collapsible='icon'>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className='flex h-full w-fit flex-row items-center gap-2 py-1'>
              <div className='flex aspect-square size-8 items-center justify-center rounded-lg'>
                {/* TODO: Replace with logo */}
                <SidebarTrigger />
              </div>
              <div
                className={cn(
                  'flex flex-col text-left text-lg leading-tight',
                  state === 'collapsed' && 'hidden',
                )}
              >
                <h1 className='font-medium'>Nova</h1>
                {/* <span className='text-muted-foreground/50 text-xs'>
                  Track your finance
                </span> */}
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
