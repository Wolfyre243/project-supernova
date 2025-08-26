import { Loader2 } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className='flex h-screen w-full flex-col items-center justify-center'>
      <Loader2 className='animate-spin' size={64} strokeWidth={1} />
      <h1 className='text-xl'>Loading...</h1>
    </div>
  );
}
