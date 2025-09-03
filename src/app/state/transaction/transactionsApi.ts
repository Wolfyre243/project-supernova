import { Transaction } from '@/lib/models';
import { apiSlice } from '../mainApiSlice';

type Granularity = 'day' | 'week' | 'month' | 'year';
type Scope = 'day' | 'week' | 'month' | 'yearly';
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
    getTransactionStatsByScope: builder.query<
      { totalAmount: number | null; date: string; transactionCount: number }[],
      { scope: Scope; type: TransactionType }
    >({
      query: ({ scope, type }) =>
        `/transaction/stats?scope=${scope}&type=${type}`,
      providesTags: ['Transactions'],
    }),
    getTransactionStatsByDate: builder.query<
      { totalAmount: number | null; date: string; transactionCount: number }[],
      { type: TransactionType; startDate: string; endDate: string }
    >({
      query: ({ type, startDate, endDate }) =>
        `/transaction/stats?type=${type}&startDate=${startDate}&endDate=${endDate}`,
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
  useGetTransactionStatsByDateQuery,
  useGetTransactionStatsByScopeQuery,
} = transactionsApi;
