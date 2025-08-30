import { Category } from '@/lib/models';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const categoriesApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  reducerPath: 'categoriesApi',
  tagTypes: ['Categories'],
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => `/category`,
      providesTags: ['Categories'],
    }),
    getCategoriesByType: builder.query<Category[], 'income' | 'expense'>({
      query: (type) => `/category?type=${type}`,
      providesTags: ['Categories'],
      // TODO: Add error handling for incorrect type here?
    }),
  }),
});

export const { useGetCategoriesQuery, useGetCategoriesByTypeQuery } =
  categoriesApiSlice;
