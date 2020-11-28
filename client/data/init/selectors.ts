import { AppState } from '@data/reducer';
import { createSelector } from '@reduxjs/toolkit';
import { initReducer } from './reducer';

export const selectInitData = (state: AppState) => state[initReducer.name];

export const selectIsAppInitialized = createSelector(
  selectInitData,
  ({ isAppInitialized }) => isAppInitialized
);
export const selectUser = createSelector(selectInitData, ({ user }) => user);
export const selectAuthData = createSelector(selectInitData, ({ jwt, uniqueId }) => ({
  jwt,
  uniqueId,
}));
