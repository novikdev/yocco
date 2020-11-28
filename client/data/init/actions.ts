import { createAction } from '@reduxjs/toolkit';
import { InitState } from './reducer';

export const setInitData = createAction<Partial<InitState>>('init/SET');
