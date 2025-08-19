import { Loader2 } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className='flex flex-col justify-center items-center w-full h-screen'>
      <Loader2 className='animate-spin' size={64} strokeWidth={1} />
      <h1 className='text-xl'>Loading...</h1>
    </div>
  );
}
