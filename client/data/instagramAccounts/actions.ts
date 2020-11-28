import { createAction } from '@reduxjs/toolkit';
import { IInstagramAccount } from '@services/api/instagram-accounts';

export const loadIgAccounts = createAction('instagramAccounts/LOAD');
export const loadIgAccountsSuccess = createAction<IInstagramAccount[]>(
  'instagramAccounts/LOAD_SUCCESS'
);
export const loadIgAccountsFail = createAction('instagramAccounts/LOAD_FAIL');

export const setDefaultIgAccount = createAction<IInstagramAccount['id']>(
  'instagramAccounts/SET_DEFAULT'
);
export const setDefaultIgAccountSuccess = createAction<IInstagramAccount['id']>(
  'instagramAccounts/SET_DEFAULT_SUCCESS'
);
