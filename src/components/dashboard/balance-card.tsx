'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import { useGetUserDetailsQuery } from '@/app/state/userDetails/userDetailsApiSlice';

// Mobile Version (minimised)
export function BalanceCardMobile() {
  // TODO: Fetch actual balance data here

  const { data, isError, isLoading, error } = useGetUserDetailsQuery();

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1>Oopsies! Error: {error.toString()}</h1>;

  return (
    <div className='flex flex-col gap-4 text-[#f9f9f9]'>
      <h2 className='text-2xl font-semibold'>Hello, {data?.name} 👋</h2>
      <div>
        <h4>Total Balance</h4>
        <h1 className='text-4xl font-semibold'>$24,300.89</h1>
      </div>
      {/* <Button onClick={() => dispatch(setNameAsync('John'))}>
          Click Me
        </Button> */}
    </div>
  );
}

// Desktop Version (expanded)
export function BalanceCard() {
  // TODO: Fetch actual balance data here
  const isMobile = useIsMobile();

  const { data, isError, isLoading, error } = useGetUserDetailsQuery();

  if (isMobile) return null;
  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1>Oopsies! Error: {error.toString()}</h1>;

  return (
    <div className='flex flex-col gap-4 text-[#f9f9f9]'>
      <h2 className='text-2xl font-semibold'>Hello, {data?.name} 👋</h2>
      <div>
        <h4>Total Balance</h4>
        <h1 className='text-4xl font-semibold'>$24,300.89</h1>
      </div>
    </div>
  );
}
