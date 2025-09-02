import { Transaction } from '@/lib/models';
import { apiSlice } from '../mainApiSlice';

type Granularity = 'day' | 'week' | 'month' | 'year';

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
  }),
});
// Export the auto-generated hooks
export const {
  useCreateIncomeMutation,
  useCreateExpenseMutation,
  useGetBalanceQuery,
  useGetIncomeTotalQuery,
  useGetExpenseTotalQuery,
} = transactionsApi;
