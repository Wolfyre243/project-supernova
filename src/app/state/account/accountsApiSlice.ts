import { Account } from '@/lib/models';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// TODO: Combine API slices
export const accountsApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  reducerPath: 'accountsApi',
  tagTypes: ['Account', 'Transactions'],
  endpoints: (builder) => ({
    getAccounts: builder.query<Partial<Account>[], void>({
      query: () => `/account`,
      providesTags: ['Account', 'Transactions'],
    }),
  }),
});

export const { useGetAccountsQuery } = accountsApiSlice;
