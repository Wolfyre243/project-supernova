import { Account } from '@/lib/models';
import { apiSlice } from '../mainApiSlice';

export const accountsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAccounts: builder.query<Partial<Account>[], void>({
      query: () => `/account`,
      providesTags: ['Accounts', 'Transactions'],
    }),
  }),
});

export const { useGetAccountsQuery } = accountsApi;
