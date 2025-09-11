import { AccountPagination } from '@/components/accounts/pagination';
import { NewAccountButton } from '@/components/dashboard/new-account-dialog';
import { BackButton } from '@/components/nav/control-buttons';

export default function DashboardAccountsPage() {
  return (
    <div className='bg-background flex h-full flex-col gap-4 p-4 pb-24 md:pb-4'>
      <div className='mb-2 flex flex-row items-center justify-between md:hidden'>
        <BackButton />
        <NewAccountButton className='size-6' />
      </div>
      <div className='flex flex-row items-center justify-between'>
        <h1 className='text-3xl font-semibold'>Accounts</h1>
        <NewAccountButton className='hidden size-6 md:block' />
      </div>
      <AccountPagination />
    </div>
  );
}
