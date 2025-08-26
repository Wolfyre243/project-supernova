'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Undo2 } from 'lucide-react';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className='flex h-screen w-full flex-col items-center justify-center gap-4'>
      <div className='max-w-1/3'>
        <h1 className='text-xl font-bold'>Aww snap!</h1>
        <h1 className='text-xl'>Error: {error.message}</h1>
      </div>
      <div className='flex flex-row gap-4'>
        {/* <Button className='rounded-xl' onClick={() => reset()}>
          <RotateCw />
          Try Again
        </Button> */}
        {/* TODO: Fix back button for error page */}
        <Button className='rounded-xl'>
          <Link href={'/home'} className='flex flex-row gap-2'>
            <Undo2 />
            Back to Home
          </Link>
        </Button>
      </div>
    </main>
  );
}
