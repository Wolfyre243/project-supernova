import { InDevCard } from '@/components/misc/in-development-card';
import { BackButton } from '@/components/nav/control-buttons';

export default function DashboardStatisticsPage() {
  return (
    <div className='bg-background flex h-full flex-col gap-4 p-4 pb-24 md:pb-4'>
      <div className='mb-2 flex flex-row items-center justify-between md:hidden'>
        <BackButton />
      </div>
      <div className='flex flex-row items-center justify-between'>
        <h1 className='text-3xl font-semibold'>Statistics</h1>
      </div>
      <div className='flex h-full flex-col justify-center'>
        <InDevCard />
      </div>
    </div>
  );
}
