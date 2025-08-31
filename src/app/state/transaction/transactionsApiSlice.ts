import { Expense, Income } from '@/lib/models';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const transactionsApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api/transaction' }),
  reducerPath: 'transactionsApi',
  tagTypes: ['Transactions'],
  endpoints: (builder) => ({
    createIncome: builder.mutation<Income, Partial<Income>>({
      query: (income) => ({
        url: `/income`,
        method: 'POST',
        body: income,
      }),
      invalidatesTags: ['Transactions'],
    }),
    createExpense: builder.mutation<Expense, Partial<Expense>>({
      query: (expense) => ({
        url: `/expense`,
        method: 'POST',
        body: expense,
      }),
      invalidatesTags: ['Transactions'],
    }),
    getBalance: builder.query<{ balance: number }, void>({
      query: () => `/balance`,
      providesTags: ['Transactions'],
    }),
  }),
});

// Export the auto-generated hooks
export const {
  useCreateIncomeMutation,
  useCreateExpenseMutation,
  useGetBalanceQuery,
} = transactionsApiSlice;
