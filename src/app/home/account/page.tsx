import { AccountPagination } from '@/components/accounts/pagination';
import { NewAccountButton } from '@/components/dashboard/new-account-dialog';
import { BackButton } from '@/components/nav/control-buttons';

export default function DashboardAccountsPage() {
  return (
    <div className='bg-background flex min-h-screen flex-col gap-4 p-4 pb-24 md:pb-6'>
      <div className='mb-2 flex flex-row items-center justify-between'>
        <BackButton />
        <NewAccountButton className='size-6' />
      </div>
      <h1 className='text-3xl font-semibold'>Accounts</h1>
      <AccountPagination />
    </div>
  );
}
