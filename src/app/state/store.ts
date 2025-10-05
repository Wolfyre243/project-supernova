import {
  configureStore,
  type Action,
  type ThunkAction,
} from '@reduxjs/toolkit';
import { listenerMiddleware } from './listenerMiddleware';
import { apiSlice } from './mainApiSlice';
import { chartFiltersSlice } from './chartFiltersSlice';
import { transactionFiltersSlice } from './transaction/transactionFiltersSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      chartFilters: chartFiltersSlice.reducer,
      transactionFilters: transactionFiltersSlice.reducer,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .prepend(listenerMiddleware.middleware)
        .concat(apiSlice.middleware),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
