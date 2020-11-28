import { LoadingStatus } from '@data/types';
import { createSlice } from '@reduxjs/toolkit';
import { IInstagramAccount } from '@services/api/instagram-accounts';
import {
  loadIgAccounts,
  loadIgAccountsFail,
  loadIgAccountsSuccess,
  setDefaultIgAccountSuccess,
} from './actions';

export type InstagramAccountsState = {
  status: LoadingStatus;
  data: IInstagramAccount[];
};

const initialState: InstagramAccountsState = {
  status: LoadingStatus.Idle,
  data: [],
};

export const instagramAccountsReducer = createSlice({
  name: 'instagramAccounts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadIgAccounts, (state) => ({
      ...state,
      status: LoadingStatus.Pending,
    }));
    builder.addCase(loadIgAccountsSuccess, (state, { payload }) => ({
      status: LoadingStatus.Success,
      data: payload,
    }));
    builder.addCase(loadIgAccountsFail, (state) => ({
      ...state,
      status: LoadingStatus.Fail,
    }));
    builder.addCase(setDefaultIgAccountSuccess, (state, { payload: defaultIgAccountId }) => ({
      ...state,
      data: state.data.map((igAccount) => ({
        ...igAccount,
        isDefault: igAccount.id === defaultIgAccountId,
      })),
    }));
  },
});
