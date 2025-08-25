import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { SidebarMenuButton, useSidebar } from './ui/sidebar';

// TODO: Should take reference from main User type instead
export type NavUserType = {
  // userId: string;
  username: string;
  name: string;
  email: string;
  role: number;
  avatarUrl?: string | null;
};

function UserHeader({ user }: { user: NavUserType }) {
  return (
    <div className='flex flex-row gap-2 items-center'>
      <Avatar className='h-8 w-8 rounded-full shadow-lg'>
        <AvatarImage src={user.avatarUrl ?? ''} />
        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <span className='text-muted-foreground truncate leading-tight font-medium'>
        {user.name}
      </span>
    </div>
  );
}

export default function NavUser({ user }: { user: NavUserType }) {
  // TODO: Add user information and profile stuff
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className='outline-0'>
        <UserHeader user={user} />
        {/* <ChevronDown className='size-4' /> */}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
        align='end'
        sideOffset={4}
      >
        <h1>hello world</h1>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
