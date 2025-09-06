import { Category } from '@/lib/models';
import { apiSlice } from '../mainApiSlice';

export const categoriesApi = apiSlice.injectEndpoints({
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
  categoriesApi;
