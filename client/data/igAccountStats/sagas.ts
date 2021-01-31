import { IHourIgAccountStats, InstagramAccounts } from '@services/api/instagram-accounts';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import * as actions from './actions';
import { selectLoadedStatsRange, Range, selectLoadedStatsIgAccountId } from './selectors';
import { differenceInHours, endOfDay, startOfDay, subDays } from 'date-fns';
import { LoadingStatus } from '@data/types';
import { Alert } from 'react-native';

const RESET_AFTER_DAYS = 2;

function* loadIgAccountStats({
  payload: igAccountId,
}: ReturnType<typeof actions.loadIgAccountStats>) {
  const currentIgAccountId: string | null = yield select(selectLoadedStatsIgAccountId);
  const loadedRange: Range = yield select(selectLoadedStatsRange);
  let resetPreviousData = true;

  const params = {
    from: startOfDay(subDays(new Date(), 1)),
    to: endOfDay(new Date()),
  };

  if (loadedRange.to) {
    const today = startOfDay(new Date());
    const lastLoadedDay = startOfDay(new Date(loadedRange.to));
    resetPreviousData = differenceInHours(today, lastLoadedDay) > RESET_AFTER_DAYS * 24;
  }

  if (currentIgAccountId !== igAccountId || resetPreviousData) {
    yield put(
      actions.setIgAccountStats({
        status: LoadingStatus.Loading,
        igAccountId,
        allDates: [],
        byDates: {},
      })
    );
  } else {
    yield put(
      actions.setIgAccountStats({
        status: LoadingStatus.Loading,
      })
    );
  }
  try {
    const stats: IHourIgAccountStats[] = yield call(
      InstagramAccounts.getAccountStats,
      igAccountId,
      params
    );
    yield put(actions.addIgAccountStats(stats));
  } catch (err) {
    Alert.alert('Не удалось загрузить статистику');
  }
}

function* loadPrevIgAccountStats(action: ReturnType<typeof actions.loadPrevIgAccountStats>) {
  const igAccountId = action.payload;
  const loadedRange: Range = yield select(selectLoadedStatsRange);
  if (!loadedRange.from) {
    yield call(loadIgAccountStats, action);
    return;
  }
  const prevDay = subDays(new Date(loadedRange.from), 1);
  const params = {
    from: startOfDay(prevDay),
    to: endOfDay(prevDay),
  };
  yield put(
    actions.setIgAccountStats({
      status: LoadingStatus.LoadingNextPage,
    })
  );

  try {
    const stats: IHourIgAccountStats[] = yield call(
      InstagramAccounts.getAccountStats,
      igAccountId,
      params
    );
    yield put(actions.addIgAccountStats(stats));
  } catch (err) {
    Alert.alert('Не удалось загрузить статистику');
  }
}

export function* igAccountStatsSaga() {
  yield takeLatest(actions.loadIgAccountStats, loadIgAccountStats);
  yield takeLatest(actions.loadPrevIgAccountStats, loadPrevIgAccountStats);
}
