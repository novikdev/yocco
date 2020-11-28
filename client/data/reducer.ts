import { combineReducers } from '@reduxjs/toolkit';
import { initReducer } from '@data/init/reducer';
import { instagramAccountsReducer } from '@data/instagramAccounts/reducer';
import { userReducer } from '@data/user/reducer';

export const reducer = combineReducers({
  [initReducer.name]: initReducer.reducer,
  [userReducer.name]: userReducer.reducer,
  [instagramAccountsReducer.name]: instagramAccountsReducer.reducer,
});

export type AppState = ReturnType<typeof reducer>;
