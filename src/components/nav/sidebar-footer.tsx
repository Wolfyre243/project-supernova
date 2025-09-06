'use client';

// import { useIsMobile } from '@/hooks/use-mobile';
import LogOutButton from '../logout-btn';

export default function AppSidebarFooter() {
  // const isMobile = useIsMobile();

  return (
    <div className=''>
      {/* TODO: Design & add more stuff in footer */}
      <LogOutButton className='bg-muted/30 my-4 justify-center p-2' />
    </div>
  );
}
