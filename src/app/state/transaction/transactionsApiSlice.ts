import { Transaction } from '@/lib/models';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type Granularity = 'day' | 'week' | 'month' | 'year';

export const transactionsApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api/transaction' }),
  reducerPath: 'transactionsApi',
  tagTypes: ['Account', 'Transactions'],
  endpoints: (builder) => ({
    createIncome: builder.mutation<Transaction, Partial<Transaction>>({
      query: (income) => ({
        url: `/income`,
        method: 'POST',
        body: income,
      }),
      invalidatesTags: ['Account', 'Transactions'],
    }),
    createExpense: builder.mutation<Transaction, Partial<Transaction>>({
      query: (expense) => ({
        url: `/expense`,
        method: 'POST',
        body: expense,
      }),
      invalidatesTags: ['Account', 'Transactions'],
    }),
    getBalance: builder.query<{ balance: number }, void>({
      query: () => `/balance`,
      providesTags: ['Transactions'],
    }),
    getIncomeTotal: builder.query<
      { totalIncome: number; incomeDifference: number },
      Granularity
    >({
      query: (granularity) => `/income?granularity=${granularity}`,
      providesTags: ['Transactions'],
    }),
    getExpenseTotal: builder.query<
      { totalExpense: number; expenseDifference: number },
      Granularity
    >({
      query: (granularity) => `/expense?granularity=${granularity}`,
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
} = transactionsApiSlice;
