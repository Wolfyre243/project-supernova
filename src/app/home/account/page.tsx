import { AccountPagination } from '@/components/accounts/pagination';

export default function DashboardAccountsPage() {
  return (
    <div className='bg-background flex flex-col gap-4 p-4 pb-24 md:pb-6'>
      <h1 className='text-2xl font-semibold'>Accounts</h1>
      <AccountPagination />
    </div>
  );
}
