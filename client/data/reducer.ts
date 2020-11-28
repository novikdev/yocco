import { combineReducers } from '@reduxjs/toolkit';
import { initReducer } from '@data/init/reducer';

export const reducer = combineReducers({
  [initReducer.name]: initReducer.reducer,
});

export type AppState = ReturnType<typeof reducer>;
