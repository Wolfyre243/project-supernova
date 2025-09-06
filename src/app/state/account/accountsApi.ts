import { Account } from '@/lib/models';
import { apiSlice } from '../mainApiSlice';

export const accountsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAccounts: builder.query<Partial<Account>[], void>({
      query: () => `/account`,
      providesTags: ['Accounts'],
    }),
    createAccount: builder.mutation<Account, Partial<Account>>({
      query: (account) => ({
        url: `/account`,
        method: 'POST',
        body: account,
      }),
      invalidatesTags: ['Accounts'],
    }),
  }),
});

export const { useGetAccountsQuery, useCreateAccountMutation } = accountsApi;
