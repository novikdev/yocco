import { IInstagramAccount, InstagramAccounts } from '@services/api/instagram-accounts';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as actions from './actions';

function* loadInstagramAccounts() {
  try {
    const accounts: IInstagramAccount[] = yield call(InstagramAccounts.getAll);
    yield put(actions.loadIgAccountsSuccess(accounts));
  } catch (err) {
    yield put(actions.loadIgAccountsFail());
  }
}

export function* instagramAccountsSaga() {
  yield takeLatest(actions.loadIgAccounts, loadInstagramAccounts);
}
