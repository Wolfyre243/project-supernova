import { ScopeFilter } from '../chart-filters';
import { TransactionChart } from './transaction-charts';

export function TransactionChartCard() {
  return (
    <div className='bg-card flex w-full flex-col gap-4 rounded-2xl border py-4'>
      <div className='flex flex-row items-center justify-between px-4'>
        <h1 className='font-semibold'>Total Balance</h1>
        <div>
          <ScopeFilter />
        </div>
      </div>
      <TransactionChart />
    </div>
  );
}
