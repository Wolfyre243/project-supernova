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
  icon: LucideIcon;
};

export const navItems: Array<NavItem> = [
  {
    title: 'Home',
    url: '/home',
    icon: Home,
  },
  {
    title: 'Accounts',
    url: '#',
    icon: Wallet,
  },
  {
    title: 'History',
    url: '#',
    icon: Receipt,
  },
  {
    title: 'Statistics',
    url: '#',
    icon: ChartNoAxesColumnIncreasing,
  },
];

export const mobileNavItems: Record<string, NavItem> = {
  home: {
    title: 'Home',
    url: '/home',
    icon: Home,
  },
  accounts: {
    title: 'Accounts',
    url: '#',
    icon: Wallet,
  },
  history: {
    title: 'History',
    url: '#',
    icon: Receipt,
  },
  statistics: {
    title: 'Statistics',
    url: '#',
    icon: ChartNoAxesColumnIncreasing,
  },
};
