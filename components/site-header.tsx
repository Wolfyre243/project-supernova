import { Separator } from './ui/separator';
import { SidebarTrigger } from './ui/sidebar';

export default function SiteHeader() {
  return (
    <header className='bg-background shadow-md flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)'>
      <div className='flex w-full items-center gap-1 px-4 lg:gap-2'>
        <SidebarTrigger className='-ml-1' />
        <Separator
          orientation='vertical'
          className='mx-2 data-[orientation=vertical]:h-4'
        />
        {/* <div className='hidden md:block'>
          <LayoutBreadcrumb href={windowHref} />
        </div> */}
        <div className='ml-auto flex items-center gap-2'>
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={'ghost'} size={'icon'}>
                <Bell />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-xs lg:w-lg shadow-lg' align='end'>
              <DropdownMenuLabel>
                <h1 className='text-md'>Notifications</h1>
              </DropdownMenuLabel>
              <NotificationList />
            </DropdownMenuContent>
          </DropdownMenu> */}
          {/* Light/Dark mode toggler */}
          {/* <ThemeSwitcher /> */}
        </div>
      </div>
    </header>
  );
}
