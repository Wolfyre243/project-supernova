import { SingleAccountBlock } from '@/components/accounts/single-account';
import { BackButton } from '@/components/nav/control-buttons';
import { MoreVertical } from 'lucide-react';

export default async function DashboardSingleAccountPage({
  params,
}: {
  params: Promise<{ accountId: string }>;
}) {
  const { accountId } = await params;

  return (
    <div className='bg-background flex h-full flex-col gap-4 p-4 pb-24 md:pb-4'>
      <div className='text-muted-foreground mb-2 flex flex-row justify-between md:hidden'>
        <BackButton />
        {/* TODO: Replace with real dropdown menu */}
        <MoreVertical className='size-5' />
      </div>
      <SingleAccountBlock accountId={accountId} />
    </div>
  );
}
