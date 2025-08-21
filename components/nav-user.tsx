import { EllipsisVertical } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from './ui/sidebar';

export type NavUser = {
  // userId: string;
  username: string;
  name: string;
  email: string;
  role: number;
  avatarUrl: string | null;
};

function UserHeader({ user }: { user: NavUser }) {
  return (
    <>
      <Avatar className='h-8 w-8 rounded-lg'>
        <AvatarImage src={user.avatarUrl ?? ''} />
        <AvatarFallback className='rounded-lg'>
          {user.name.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <span className='text-muted-foreground truncate leading-tight font-medium'>
        {user.name}
      </span>
    </>
  );
}

// TODO: Put this in the dashboard topbar instead
export default function NavUser({ user }: { user: NavUser }) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton>
              <UserHeader user={user} />
              <EllipsisVertical className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          ></DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
