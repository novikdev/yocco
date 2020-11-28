import {
  Action,
  configureStore,
  EnhancedStore,
  getDefaultMiddleware,
  Reducer,
} from '@reduxjs/toolkit';
import createSagaMiddleware, { Saga } from 'redux-saga';

const devMode = process.env.NODE_ENV === 'development';

export function createStore<S, A extends Action>(
  reducer: Reducer<S, A>,
  saga: Saga
): EnhancedStore<S, A> {
  const sagaMiddleware = createSagaMiddleware();
  const middleware = [...getDefaultMiddleware({ thunk: false }), sagaMiddleware];

  const store = configureStore({
    reducer,
    devTools: devMode,
    middleware,
  });

  sagaMiddleware.run(saga);

  return store;
}
