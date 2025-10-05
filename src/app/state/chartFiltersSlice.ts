import { createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';

export interface ChartFilterState {
  startDate?: string;
  endDate?: string;
  scope?: 'week' | 'month' | 'year';
}

// Define the initial state using that type
const now = new Date();
const initialState: ChartFilterState = {
  scope: 'month',
  startDate: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
  endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString(),
};

export const chartFiltersSlice = createSlice({
  name: 'chartFilters',
  initialState,
  reducers: {
    setRangeThisWeek: (state) => {
      state.scope = 'week';
    },
    setRangeThisMonth: (state) => {
      state.scope = 'month';
    },
    setRangeThisYear: (state) => {
      state.scope = 'year';
    },
  },
});

export const { setRangeThisWeek, setRangeThisMonth, setRangeThisYear } =
  chartFiltersSlice.actions;

export const selectChartFilters = (state: RootState) => state.chartFilters;

export default chartFiltersSlice.reducer;
