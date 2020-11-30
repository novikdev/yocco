import { AnyAction, combineReducers } from '@reduxjs/toolkit';
import { initReducer } from '@data/init/reducer';
import { instagramAccountsReducer } from '@data/instagramAccounts/reducer';
import { userReducer } from '@data/user/reducer';
import { confirmLogout } from './init/actions';

const appReducer = combineReducers({
  [initReducer.name]: initReducer.reducer,
  [userReducer.name]: userReducer.reducer,
  [instagramAccountsReducer.name]: instagramAccountsReducer.reducer,
});

export const reducer = (state: AppState | undefined, action: AnyAction) => {
  if (action.type === confirmLogout.type) {
    state = undefined;
  }

  return appReducer(state, action);
};

export type AppState = ReturnType<typeof appReducer>;
