import React from 'react';
import * as Updates from 'expo-updates';
import { Toast } from '@components/Toast';

function askForUpdate() {
  Toast.show({
    type: 'with_buttons',
    text1: 'Приложение обновлено',
    text2: 'Перезапустите, чтобы применить обновления',
    props: {
      button1: {
        text: 'Применить',
        onPress: Updates.reloadAsync,
      },
      button2: {
        text: 'Потом',
        onPress: Toast.hide,
      },
    },
    autoHide: false,
  });
}
/**
 * handle async over the air update
 * ask user to refresh, when new version is downloaded
 * for more info see https://docs.expo.io/guides/configuring-ota-updates/
 */
export function useAsyncUpdate() {
  React.useEffect(() => {
    const asyncMockUpdate = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      askForUpdate();
    };

    const asyncUpdate = async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          askForUpdate();
        }
      } catch (e) {
        // do nothing
      }
    };
    __DEV__ ? asyncMockUpdate() : asyncUpdate();
  }, []);
}
