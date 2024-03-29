import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import { nanoid } from 'nanoid/async/index.native';
import { all, call, put, take, takeLatest } from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SagaIterator } from 'redux-saga';
import * as actions from './actions';
import { initializeApiInterceptor } from '@services/api';
import { AuthData } from './types';
import { AnyAction } from '@reduxjs/toolkit';
import { loadUser, loadUserFinish } from '@data/user/actions';
import { Auth } from '@services/api/auth';
import { Alert } from 'react-native';

const AUTH_DATA_KEY = 'auth';

const isAuthDataSetting = ({ type, payload }: AnyAction): boolean =>
  type === actions.setInitData.type && (payload.jwt || payload.uniqueId);

export function* initSaga(): SagaIterator {
  yield takeLatest(isAuthDataSetting, setAuthData);
  yield takeLatest(actions.logout, logout);

  // uncomment to reset AsyncStorage on app start
  // yield call(AsyncStorage.removeItem, AUTH_DATA_KEY);

  try {
    let [authDataString]: [string] = yield all([
      call(AsyncStorage.getItem, AUTH_DATA_KEY),
      call(Font.loadAsync, {
        ...Ionicons.font,
        'space-mono': require('../../assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);

    let { jwt, uniqueId }: Partial<AuthData> = JSON.parse(authDataString) || {};

    if (!uniqueId) {
      uniqueId = yield call(nanoid);
    }

    yield put(actions.setInitData({ jwt, uniqueId }));

    if (jwt) {
      yield put(loadUser('silent'));
      yield take(loadUserFinish);
    }
  } catch (err) {
    console.error('Failed to initialize app.\n', err.message);
  } finally {
    yield put(actions.setInitData({ isAppInitialized: true }));
  }
}

function* setAuthData(action: ReturnType<typeof actions.setInitData>) {
  const { jwt, uniqueId } = action.payload;
  const authData: Partial<AuthData> = {};
  if (jwt) {
    authData.jwt = jwt;
  }
  if (uniqueId) {
    authData.uniqueId = uniqueId;
  }

  initializeApiInterceptor(authData);
  yield call(AsyncStorage.mergeItem, AUTH_DATA_KEY, JSON.stringify(authData));
}

function confirmLagout() {
  return new Promise<boolean>((resolve) => {
    Alert.alert('Вы точно хотите выйти из приложения?', '', [
      {
        text: 'Да',
        onPress: () => {
          resolve(true);
        },
      },
      {
        text: 'Нет',
        onPress: () => {
          resolve(false);
        },
      },
    ]);
  });
}

function* logout(action: ReturnType<typeof actions.logout>) {
  const silent = action.payload.silent;

  if (!silent) {
    const confirmed: boolean = yield call(confirmLagout);
    if (!confirmed) {
      return;
    }
    yield call(Auth.logout);
  }
  yield call(AsyncStorage.removeItem, AUTH_DATA_KEY);
  yield put(actions.confirmLogout());
  yield call(initSaga);
}
