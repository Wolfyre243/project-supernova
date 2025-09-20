import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

type TransactionType = 'income' | 'expense';

export interface TransactionFilterState {
  accountIds: string[];
  categoryIds: string[];
  type?: TransactionType;
  searchTerm?: string;
}

const initialState: TransactionFilterState = {
  accountIds: [],
  categoryIds: [],
  searchTerm: '',
};

export const transactionFiltersSlice = createSlice({
  name: 'transactionFilters',
  initialState,
  reducers: {
    setTransactionType: (state, action: { payload: TransactionType }) => {
      if (state.type === action.payload) {
        state.type = undefined;
        return;
      }
      state.type = action.payload;
    },
    setSearchTerm: (state, action: { payload: string }) => {
      state.searchTerm = action.payload;
    },
    addCategoryId: (state, action: { payload: string }) => {
      // If the category ID is already selected, remove it (toggle off)
      if (state.categoryIds.includes(action.payload)) {
        state.categoryIds = state.categoryIds.filter(
          (id) => id !== action.payload,
        );
      } else {
        state.categoryIds.push(action.payload);
      }
      state.categoryIds = Array.from(new Set(state.categoryIds));
    },
    clearCategoryIds: (state) => {
      state.categoryIds = [];
    },
  },
});

export const {
  setTransactionType,
  setSearchTerm,
  addCategoryId,
  clearCategoryIds,
} = transactionFiltersSlice.actions;

export const selectTransactionFilters = (state: RootState) =>
  state.transactionFilters;

export default transactionFiltersSlice.reducer;
