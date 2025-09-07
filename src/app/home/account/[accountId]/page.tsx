export default async function DashboardSingleAccountPage({
  params,
}: {
  params: Promise<{ accountId: string }>;
}) {
  const { accountId } = await params;

  return (
    <div className='bg-background flex flex-col gap-4 rounded-t-3xl p-6 pb-24 md:rounded-none md:pb-6'>
      {/* Row 1 */}
      <div className='flex w-full flex-row gap-4'>
        {/* Card Display */}
        <div className='flex w-fit flex-col gap-2'>
          {/* Account Card */}
          <div className='bg-card flex w-[15vw] flex-col justify-center gap-2 rounded-2xl border p-4'>
            <div className='bg-accent h-10 w-10 rounded-full' />
            <div>
              <h2 className='text-muted-foreground text-lg'>Debit Card</h2>
              <h1 className='text-3xl font-semibold'>$2,430.00</h1>
            </div>
          </div>

          <span className='text-muted text-sm'>Last Updated: 2 mins ago</span>
          <span className='text-muted text-sm'>{accountId}</span>
        </div>
      </div>
    </div>
  );
}
