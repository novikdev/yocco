import { AppState } from '@data/reducer';
import { instagramAccountsReducer } from './reducer';

export const selectInstagramAccounts = (state: AppState) => state[instagramAccountsReducer.name];
