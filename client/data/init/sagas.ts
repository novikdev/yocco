import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import { nanoid } from 'nanoid/async/index.native';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SagaIterator } from 'redux-saga';
import * as actions from './actions';
import { Auth } from '@services/api/auth';
import { initializeApiInterceptor } from '@services/api/api';
import { AuthData, User } from './types';
import { AnyAction } from '@reduxjs/toolkit';
import { Alert } from 'react-native';

const AUTH_DATA_KEY = 'auth';

const isAuthDataSetting = ({ type, payload }: AnyAction): boolean =>
  type === actions.setInitData.type && (payload.jwt || payload.uniqueId);

export function* initSaga(): SagaIterator {
  yield takeLatest(isAuthDataSetting, setAuthData);
  yield takeLatest(actions.loadUser, loadUser);

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
      const user: User = yield call(Auth.getMe);

      if (user) {
        yield put(actions.setInitData({ user }));
      }
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

function* loadUser() {
  try {
    const user: User = yield call(Auth.getMe);
    if (user) {
      yield put(actions.setInitData({ user }));
    }
  } catch (err) {
    Alert.alert('Failed to load user information', err.message);
  }
}
