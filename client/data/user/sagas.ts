import * as igAccountActions from '@data/instagramAccounts/actions';
import { IUser, Users } from '@services/api/users';
import { Alert } from 'react-native';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import * as actions from './actions';
import { selectDefaultIgAccount } from './selectors';

function* loadUser({ payload: mode }: ReturnType<typeof actions.loadUser>) {
  try {
    const user: IUser = yield call(Users.getMe);
    yield put(actions.setUser(user));
  } catch (err) {
    if (mode !== 'silent') {
      Alert.alert('Не удалось загрузить информацию о пользователе', err.message);
    }
  } finally {
    yield put(actions.loadUserFinish());
  }
}

function* setDefaultIgAccount({
  payload: id,
}: ReturnType<typeof igAccountActions.setDefaultIgAccount>) {
  try {
    const user: IUser = yield call(Users.patchMe, { defaultInstagramAccountId: id });
    yield put(actions.setUser(user));
    yield put(igAccountActions.setDefaultIgAccountSuccess(id));
  } catch (err) {
    Alert.alert('Не удалось сохранить изменения', err.message);
  }
}

export function* userSaga() {
  yield takeLatest(actions.loadUser, loadUser);
  yield takeLatest(igAccountActions.setDefaultIgAccount, setDefaultIgAccount);
}
