import { createSlice } from '@reduxjs/toolkit';

const statusSlice = createSlice({
  name: 'statuses',
  initialState: {
    statuses: [],
  },

  reducers: {
    addStatus: (state, action) => {
      state.statuses.push(action.payload);
    },
    addStatuses: (state, action) => {
      state.statuses = action.payload;
    },
    updateStatus: (state, action) => {
      const index = state.statuses.findIndex(
        (status) => status.id === action.payload.id
      );
      state.statuses[index] = action.payload;
    },
    deleteStatus: (state, action) => {
      const index = state.statuses.findIndex(
        (status) => status.id === action.payload.id
      );
      state.statuses.splice(index, 1);
    },
  },
});

export const selectStatuses = (state) => state.statuses.statuses;

export const { addStatus, addStatuses, updateStatus, deleteStatus } =
  statusSlice.actions;

export default statusSlice.reducer;
