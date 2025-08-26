import { Plus } from 'lucide-react';

export default function BottomBar() {
  return (
    <nav className='border-muted/50 bg-background flex w-full flex-row items-center justify-center border-t px-2 py-3'>
      <button className='bg-homepage-gradient h-fit w-fit rounded-full p-2'>
        <Plus className='size-8 text-[#f9f9f9]' />
      </button>
    </nav>
  );
}
