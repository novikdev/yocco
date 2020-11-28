import { AppState } from "@data/reducer";
import { createSelector } from "@reduxjs/toolkit";
import { userReducer } from './reducer';

export const selectUser = (state: AppState) => state[userReducer.name];

export const selectDefaultIgAccount = createSelector(
  selectUser,
  (user) => user && user.defaultInstagramAccount
);
