import { ScopeFilter } from '../chart-filters';
import { TransactionChart } from './transaction-charts';

export function TransactionChartCard() {
  return (
    <div className='md:bg-card flex w-full flex-col gap-4 py-4 md:rounded-2xl md:border'>
      <div className='flex flex-row items-center justify-between md:px-4'>
        <h1 className='font-semibold'>Total Balance</h1>
        <div>
          <ScopeFilter />
        </div>
      </div>
      <TransactionChart />
    </div>
  );
}
