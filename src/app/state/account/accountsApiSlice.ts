import { Account } from '@/lib/models';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const accountsApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  reducerPath: 'accountsApi',
  tagTypes: ['Account'],
  endpoints: (builder) => ({
    getAccounts: builder.query<Account[], void>({
      query: () => `/account`,
      providesTags: ['Account'],
    }),
  }),
});

export const { useGetAccountsQuery } = accountsApiSlice;
