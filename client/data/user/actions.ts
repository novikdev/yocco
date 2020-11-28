import { createAction } from '@reduxjs/toolkit';
import { IUpdateUser, IUser } from '@services/api/users';

type LoadUserMode = 'silent' | 'default';

export const loadUser = createAction('user/LOAD', (mode: LoadUserMode = 'default') => ({
  payload: mode,
}));
export const setUser = createAction<IUser>('user/SET');
export const loadUserFinish = createAction('user/LOAD_FINISH');
export const patchUser = createAction<IUpdateUser>('user/PATCH');

