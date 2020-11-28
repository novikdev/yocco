import { createSlice } from '@reduxjs/toolkit';
import { IUser } from '@services/api/users';
import { setUser } from './actions';

export type UserState = IUser | null;

export const userReducer = createSlice({
  name: 'user',
  initialState: null as UserState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setUser, (state, { payload }) => payload);
  },
});
