'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import { useGetUserDetailsQuery } from '@/app/state/userDetails/userDetailsApiSlice';
import { useGetBalanceQuery } from '@/app/state/transaction/transactionsApiSlice';

// Mobile Version (minimised)
export function BalanceCardMobile() {
  const { data: userBalance } = useGetBalanceQuery();
  const {
    data: userDetails,
    isError,
    isLoading,
    error,
  } = useGetUserDetailsQuery();

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1>Oopsies! Error: {error.toString()}</h1>;

  return (
    <div className='flex flex-col gap-4 text-[#f9f9f9]'>
      <h2 className='text-2xl font-semibold'>Hello, {userDetails?.name} 👋</h2>
      <div>
        <h4>Total Balance</h4>
        <h1 className='text-4xl font-semibold'>
          ${userBalance?.balance.toFixed(2)}
        </h1>
      </div>
    </div>
  );
}

// Desktop Version (expanded)
export function BalanceCard() {
  // TODO: Fetch actual balance data here
  const isMobile = useIsMobile();

  const { data: userBalance } = useGetBalanceQuery();
  const {
    data: userDetails,
    isError,
    isLoading,
    error,
  } = useGetUserDetailsQuery();

  if (isMobile) return null;
  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1>Oopsies! Error: {error.toString()}</h1>;

  return (
    <div className='flex flex-col gap-4'>
      <h2 className='text-2xl font-semibold'>Hello, {userDetails?.name} 👋</h2>
      <div>
        <h4>Total Balance</h4>
        <h1 className='text-4xl font-semibold'>
          ${userBalance?.balance.toFixed(2)}
        </h1>
      </div>
      {/* TODO: Add chart trend + comment here */}
    </div>
  );
}
