import { UserDetails } from '@/lib/models';
import { apiSlice } from '../mainApiSlice';

export const userDetailsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserDetails: builder.query<UserDetails, void>({
      query: () => `/user`,
      providesTags: ['User'],
    }),
  }),
});

export const { useGetUserDetailsQuery } = userDetailsApi;
