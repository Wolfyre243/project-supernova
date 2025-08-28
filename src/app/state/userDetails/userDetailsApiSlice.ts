import { UserDetails } from '@/lib/models';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userDetailsApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  reducerPath: 'userDetailsApi',
  tagTypes: ['UserDetails'],
  endpoints: (builder) => ({
    getUserDetails: builder.query<UserDetails, void>({
      query: () => `/user`, // Default is GET, but doing something like
      // {url: '/posts', method: 'POST', body: newPost} will do a POST
    }),
  }),
});

export const { useGetUserDetailsQuery } = userDetailsApiSlice;
