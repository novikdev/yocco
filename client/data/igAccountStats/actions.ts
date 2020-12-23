import { createAction } from '@reduxjs/toolkit';
import { IHourIgAccountStats } from '@services/api/instagram-accounts';
import { IgAccountStatsState } from './reducer';

export const loadIgAccountStats = createAction<number>('igAccountStats/LOAD');
export const loadPrevIgAccountStats = createAction<number>('igAccountStats/LOAD_PREV');
export const setIgAccountStats = createAction<Partial<IgAccountStatsState>>('igAccountStats/SET');
export const addIgAccountStats = createAction<IHourIgAccountStats[]>('igAccountStats/ADD');
