import {
  ChartNoAxesColumnIncreasing,
  Home,
  LucideIcon,
  Receipt,
  Wallet,
} from 'lucide-react';

export type NavItem = {
  title: string;
  url: string;
  icon: string; // icon key
};

export type NavIconItem = {
  title: string;
  url: string;
  icon: LucideIcon; // icon key
};

export const navItems: Array<NavItem> = [
  {
    title: 'Home',
    url: '/home',
    icon: 'home',
  },
  {
    title: 'Accounts',
    url: '/home/account',
    icon: 'wallet',
  },
  {
    title: 'Activity',
    url: '#',
    icon: 'receipt',
  },
  {
    title: 'Statistics',
    url: '#',
    icon: 'chart',
  },
];

export const navSecondaryItems: Array<NavItem> = [
  {
    title: 'Settings',
    url: '/home/settings',
    icon: 'settings',
  },
  {
    title: 'Help & Information',
    url: '/help',
    icon: 'help',
  },
];

export const mobileNavItems: NavIconItem[] = [
  {
    title: 'Home',
    url: '/home',
    icon: Home,
  },
  {
    title: 'Accounts',
    url: '/home/account',
    icon: Wallet,
  },
  {
    title: 'Activity',
    url: '/home/activity',
    icon: Receipt,
  },
  {
    title: 'Statistics',
    url: '/home/statistics',
    icon: ChartNoAxesColumnIncreasing,
  },
];
