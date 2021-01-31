import { createAction } from '@reduxjs/toolkit';
import { InitState } from './reducer';

export const setInitData = createAction<Partial<InitState>>('init/SET');
export const logout = createAction<{ silent: boolean }>('init/LOGOUT');
export const confirmLogout = createAction('init/CONFIRM_LOGOUT');
