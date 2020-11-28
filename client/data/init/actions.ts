import { createAction } from '@reduxjs/toolkit';
import { InitState } from './reducer';

export const setInitData = createAction<Partial<InitState>>('init/set');
export const loadUser = createAction('init/loadUser');
