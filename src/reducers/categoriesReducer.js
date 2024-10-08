// Categories reducer

import { createSlice } from '@reduxjs/toolkit';

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
  },

  reducers: {
    addCategory: (state, action) => {
      state.categories.push(action.payload);
    },
    addCategories: (state, action) => {
      state.categories = action.payload;
    },
    updateCategory: (state, action) => {
      const index = state.categories.findIndex(
        (category) => category.id === action.payload.id
      );
      state.categories[index] = action.payload;
    },
    deleteCategory: (state, action) => {
      const index = state.categories.findIndex(
        (category) => category.id === action.payload.id
      );
      state.categories.splice(index, 1);
    },
  },
});

export const selectCategories = (state) => state.categories.categories;

export const { addCategory, addCategories, updateCategory, deleteCategory } =
  categorySlice.actions;

export default categorySlice.reducer;
