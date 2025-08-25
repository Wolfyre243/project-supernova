import { Separator } from '@radix-ui/react-separator';
import { SearchBar } from './searchbar';
import NavUser, { NavUserType } from './nav-user';
import { Roles } from '@/config/authConfig';
import { Bell, Settings } from 'lucide-react';
import { ThemeToggler } from './theme-provider';

// TODO: Date should be fetched instead
const user = {
  username: 'bigbellyman79',
  name: 'Wolfyre',
  email: 'wolfyreblueflare@gmail.com',
  role: Roles.USER,
} as NavUserType;

// TODO: Add notification functionality
function NotificationButton() {
  return (
    <div className='p-2 w-fit rounded-full border border-muted'>
      <Bell className='size-4' />
    </div>
  );
}

function SettingsButton() {
  return (
    <div className='p-2 w-fit rounded-full border border-muted'>
      <Settings className='size-4' />
    </div>
  );
}

export default function SiteHeader() {
  return (
    <header className='bg-background shadow-md flex h-(--header-height) flex-shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)'>
      <nav className='flex flex-row w-full h-full justify-between items-center gap-1 px-4 lg:gap-2'>
        {/* <SidebarTrigger className='-ml-1' /> */}
        {/* <Separator
          orientation='vertical'
          className='mx-2 data-[orientation=vertical]:h-4'
        /> */}

        <div className='hidden md:block'>
          {/* TODO: Add Breadcrumb */}
          {/* <LayoutBreadcrumb href={windowHref} /> */}
          <h1>Dashboard</h1>
        </div>

        {/* Search Bar */}
        <SearchBar />

        <div className='flex flex-row gap-3 items-center'>
          <div className='flex flex-row items-center gap-3'>
            <ThemeToggler />
            <NotificationButton />
            <SettingsButton />
          </div>
          <Separator
            orientation='vertical'
            className='border-muted border-l-[0.5px] data-[orientation=vertical]:h-6'
          />
          <NavUser user={user} />
        </div>
      </nav>
      {/* TODO: Add mobile version */}
    </header>
  );
}
