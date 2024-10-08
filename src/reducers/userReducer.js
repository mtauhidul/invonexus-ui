import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userID: '',
  username: '',
  token: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.userID = action.payload.userID;
      state.username = action.payload.username;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.userID = '';
      state.username = '';
      state.token = '';
    },
  },
});

export const selectUser = (state) => state.user;

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
