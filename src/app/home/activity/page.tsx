import { BackButton } from '@/components/nav/control-buttons';
import { TransactionPagination } from '@/components/transactions/pagination';

export default function DashboardActivityPage() {
  return (
    <div className='bg-background flex h-full flex-col gap-4 p-4 pb-24 md:pb-4'>
      <div className='mb-2 flex flex-row items-center justify-between md:hidden'>
        <BackButton />
      </div>
      <div className='flex flex-row items-center justify-between'>
        <h1 className='text-3xl font-semibold'>Transactions</h1>
      </div>
      <TransactionPagination />
    </div>
  );
}
