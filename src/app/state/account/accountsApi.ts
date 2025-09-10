import { Account } from '@/lib/models';
import { apiSlice } from '../mainApiSlice';

export const accountsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAccounts: builder.query<Partial<Account>[], void>({
      query: () => `/account`,
      providesTags: ['Accounts'],
    }),
    getAccountPagination: builder.query<
      {
        data: Partial<Account>[];
        totalItems: number;
        totalPages: number;
      },
      {
        page: number;
        limit: number;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
      }
    >({
      query: ({ page, limit, sortBy, sortOrder }) => {
        const params = new URLSearchParams();
        params.set('page', page.toString());
        params.set('limit', limit.toString());
        if (sortBy) {
          params.set('sortBy', sortBy);
        }
        if (sortOrder) {
          params.set('sortOrder', sortOrder);
        }
        return `/account/paginated?${params.toString()}`;
      },
      providesTags: ['Accounts', 'Transactions'],
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

export const {
  useGetAccountsQuery,
  useGetAccountPaginationQuery,
  useCreateAccountMutation,
} = accountsApi;
