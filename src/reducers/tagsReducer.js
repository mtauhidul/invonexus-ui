import { createSlice } from '@reduxjs/toolkit';

const tagSlice = createSlice({
  name: 'tags',
  initialState: {
    tags: [],
  },

  reducers: {
    addTag: (state, action) => {
      state.tags.push(action.payload);
    },
    addTags: (state, action) => {
      state.tags = action.payload;
    },
    updateTag: (state, action) => {
      const index = state.tags.findIndex((tag) => tag.id === action.payload.id);
      state.tags[index] = action.payload;
    },
    deleteTag: (state, action) => {
      const index = state.tags.findIndex((tag) => tag.id === action.payload.id);
      state.tags.splice(index, 1);
    },
  },
});

export const selectTags = (state) => state.tags.tags;

export const { addTag, addTags, updateTag, deleteTag } = tagSlice.actions;

export default tagSlice.reducer;
