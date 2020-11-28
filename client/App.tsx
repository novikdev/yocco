import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider, useSelector } from 'react-redux';

import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { createStore } from '@services/store';
import { selectIsAppInitialized } from '@data/init/selectors';
import { LogBox } from 'react-native';
import { reducer } from '@data/reducer';
import { saga } from '@data/saga';
import { AppLoading } from 'expo';

LogBox.ignoreLogs(['Remote debugger', 'Native splash screen is already hidden']);

const store = createStore(reducer, saga);

export default function AppInitializer() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

function App() {
  const isAppInitialized = useSelector(selectIsAppInitialized);
  const colorScheme = useColorScheme();

  if (!isAppInitialized) {
    return <AppLoading />;
  } else {
    return (
      <Provider store={store}>
        <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </SafeAreaProvider>
      </Provider>
    );
  }
}
