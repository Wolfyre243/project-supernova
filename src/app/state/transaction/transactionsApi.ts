import { Transaction } from '@/lib/models';
import { apiSlice } from '../mainApiSlice';

type Granularity = 'day' | 'week' | 'month' | 'year';
type Scope = 'week' | 'month' | 'year' | 'all';
type TransactionType = 'income' | 'expense';

export const transactionsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createIncome: builder.mutation<Transaction, Partial<Transaction>>({
      query: (income) => ({
        url: `/transaction/income`,
        method: 'POST',
        body: income,
      }),
      invalidatesTags: ['Accounts', 'Transactions'],
    }),
    createExpense: builder.mutation<Transaction, Partial<Transaction>>({
      query: (expense) => ({
        url: `/transaction/expense`,
        method: 'POST',
        body: expense,
      }),
      invalidatesTags: ['Accounts', 'Transactions'],
    }),
    getBalance: builder.query<{ balance: number }, void>({
      query: () => `/transaction/balance`,
      providesTags: ['Transactions'],
    }),
    getIncomeTotal: builder.query<
      { totalIncome: number; incomeDifference: number },
      Granularity
    >({
      query: (granularity) => `/transaction/income?granularity=${granularity}`,
      providesTags: ['Transactions'],
    }),
    getExpenseTotal: builder.query<
      { totalExpense: number; expenseDifference: number },
      Granularity
    >({
      query: (granularity) => `/transaction/expense?granularity=${granularity}`,
      providesTags: ['Transactions'],
    }),
    getTransactionStats: builder.query<
      { totalAmount: number | null; date: string; transactionCount: number }[],
      {
        scope?: Scope;
        type?: TransactionType;
        startDate?: string;
        endDate?: string;
      }
    >({
      query: ({ scope, type, startDate, endDate }) => {
        const url = '/transaction/stats';
        const params = new URLSearchParams();
        if (scope) params.append('scope', scope);
        if (type) params.append('type', type);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        return `${url}?${params.toString()}`;
      },
      providesTags: ['Transactions'],
    }),
    // getTransactionStatsByDate: builder.query<
    //   { totalAmount: number | null; date: string; transactionCount: number }[],
    //   { type: TransactionType; startDate: string; endDate: string }
    // >({
    //   query: ({ type, startDate, endDate }) =>
    //     `/transaction/stats?type=${type}&startDate=${startDate}&endDate=${endDate}`,
    //   providesTags: ['Transactions'],
    // }),
  }),
});
// Export the auto-generated hooks
export const {
  useCreateIncomeMutation,
  useCreateExpenseMutation,
  useGetBalanceQuery,
  useGetIncomeTotalQuery,
  useGetExpenseTotalQuery,
  useGetTransactionStatsQuery,
} = transactionsApi;
