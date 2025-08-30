import { Expense, Income } from '@/lib/models';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const transactionsApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  reducerPath: 'transactionsApi',
  tagTypes: ['Transactions'],
  endpoints: (builder) => ({
    createIncome: builder.mutation<Income, Partial<Income>>({
      query: (income) => ({
        url: `/transaction/income`,
        method: 'POST',
        body: income,
      }),
      invalidatesTags: ['Transactions'],
    }),
    createExpense: builder.mutation<Expense, Partial<Expense>>({
      query: (expense) => ({
        url: `/transaction/expense`,
        method: 'POST',
        body: expense,
      }),
      invalidatesTags: ['Transactions'],
    }),
  }),
});

// Export the auto-generated hooks
export const { useCreateIncomeMutation, useCreateExpenseMutation } =
  transactionsApiSlice;
