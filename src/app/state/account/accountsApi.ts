import { Account, Category } from '@/lib/models';
import { apiSlice } from '../mainApiSlice';

interface AccountStats extends Partial<Account> {
  income?: {
    total: number;
    categoryDistribution: (Partial<Category> & { count: number })[];
  };
  expense?: {
    total: number;
    categoryDistribution: (Partial<Category> & { count: number })[];
  };
}

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
        searchTerm?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
      }
    >({
      query: ({ page, limit, searchTerm, sortBy, sortOrder }) => {
        const params = new URLSearchParams();
        params.set('page', page.toString());
        params.set('limit', limit.toString());
        if (searchTerm) {
          params.set('search', searchTerm);
        }
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
    getSingleAccount: builder.query<AccountStats, string>({
      query: (accountId: string) => `/account/${accountId}`,
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
  useGetSingleAccountQuery,
  useCreateAccountMutation,
} = accountsApi;
