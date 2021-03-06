import { fork } from 'redux-saga/effects';
import { initSaga } from './init/sagas';
import { userSaga } from './user/sagas';
import { instagramAccountsSaga } from './instagramAccounts/sagas';
import { igAccountStatsSaga } from './igAccountStats/sagas';

export function* saga() {
  yield fork(initSaga);
  yield fork(userSaga);
  yield fork(instagramAccountsSaga);
  yield fork(igAccountStatsSaga);
}
