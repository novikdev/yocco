import { fork } from 'redux-saga/effects';
import { initSaga } from './init/sagas';

export function* saga() {
  yield fork(initSaga);
}
