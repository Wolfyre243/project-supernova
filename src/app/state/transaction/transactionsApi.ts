import { Transaction } from '@/lib/models';
import { apiSlice } from '../mainApiSlice';

type Granularity = 'day' | 'week' | 'month' | 'year';
type Scope = 'week' | 'month' | 'year' | 'all';
type TransactionType = 'income' | 'expense';

export const transactionsApi = apiSlice.injectEndpoints({
  overrideExisting: true,
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

    getTransactionStats: builder.query<
      {
        totalAmount: number | null;
        date: string;
        transactionCount: number;
        totalIncome?: number;
        totalExpense?: number;
      }[],
      {
        scope?: Scope;
        accountIds?: string[];
        type?: TransactionType;
        startDate?: string;
        endDate?: string;
      }
    >({
      query: ({ scope, accountIds, type, startDate, endDate }) => {
        const url = '/transaction/stats';
        const params = new URLSearchParams();
        if (scope) params.append('scope', scope);
        if (accountIds && accountIds.length > 0)
          params.append('accountIds', accountIds.join(','));
        if (type) params.append('type', type);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        return `${url}?${params.toString()}`;
      },
      providesTags: ['Transactions'],
    }),

    getAllTransactions: builder.query<
      {
        count: number;
        transactions: Transaction[] | Record<string, Transaction[]>;
      },
      {
        accountIds?: string[];
        categoryIds?: string[];
        type?: TransactionType;
        groupBy?: 'date';
      }
    >({
      query: ({ accountIds, categoryIds, type, groupBy } = {}) => {
        const params = new URLSearchParams();
        if (accountIds && accountIds.length > 0)
          params.append('accountIds', accountIds.join(','));
        if (categoryIds && categoryIds.length > 0)
          params.append('categoryIds', categoryIds.join(','));
        if (type) params.append('type', type);
        if (groupBy) params.append('groupBy', groupBy);
        return `/transaction?${params.toString()}`;
      },
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
  useGetTransactionStatsQuery,
  useGetAllTransactionsQuery,
} = transactionsApi;
