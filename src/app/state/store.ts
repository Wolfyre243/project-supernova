import {
  configureStore,
  type Action,
  type ThunkAction,
} from '@reduxjs/toolkit';
import { userDetailsApiSlice } from './userDetails/userDetailsApiSlice';
import { listenerMiddleware } from './listenerMiddleware';
import { categoriesApiSlice } from './category/categoriesApiSlice';
import { accountsApiSlice } from './account/accountsApiSlice';
import { transactionsApiSlice } from './transaction/transactionsApiSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      // users: usersReducer <- example if not using createApi
      [userDetailsApiSlice.reducerPath]: userDetailsApiSlice.reducer,
      [categoriesApiSlice.reducerPath]: categoriesApiSlice.reducer,
      [accountsApiSlice.reducerPath]: accountsApiSlice.reducer,
      [transactionsApiSlice.reducerPath]: transactionsApiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .prepend(listenerMiddleware.middleware)
        .concat(userDetailsApiSlice.middleware)
        .concat(categoriesApiSlice.middleware)
        .concat(accountsApiSlice.middleware)
        .concat(transactionsApiSlice.middleware),
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
