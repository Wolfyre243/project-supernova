import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { navItems, navSecondaryItems } from '@/config/navConfig';
import { NavGroup, NavGroupSecondary } from './nav-group';
import { AppSidebarHeader } from './sidebar-header';
import LogOutButton from '../logout-btn';
import AppSidebarFooter from './sidebar-footer';

export function AppSidebar() {
  return (
    <Sidebar variant='sidebar' collapsible='icon'>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <AppSidebarHeader />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Main Navigation */}
        <NavGroup items={navItems} />
        <SidebarSeparator />
        <NavGroupSecondary items={navSecondaryItems} className='mt-auto' />
      </SidebarContent>
      <SidebarFooter>
        {/* TODO: Put Premium Ad here, or free trial card, etc */}
        <SidebarMenu>
          <SidebarMenuItem>
            <AppSidebarFooter />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
