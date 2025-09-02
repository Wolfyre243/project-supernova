// This file contains the main API slice for managing API calls and state in the application.
// The purpose is to ensure easier tag invalidation to refresh data when new data comes in, to prevent unnecessary re-renders and subscriptions.

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: () => ({}),
  tagTypes: ['User', 'Categories', 'Accounts', 'Transactions'],
});
