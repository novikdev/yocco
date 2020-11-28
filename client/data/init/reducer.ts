import { createSlice } from '@reduxjs/toolkit';
import { setInitData } from './actions';
import { AuthData } from './types';

export type InitState = AuthData & {
  isAppInitialized: boolean;
};

const initialState: InitState = {
  isAppInitialized: false,
};

export const initReducer = createSlice({
  name: 'init',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setInitData, (state, { payload }) => ({
      ...state,
      ...payload,
    }));
  },
});
