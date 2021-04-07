import React from 'react';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { Auth } from '@services/api/auth';
import { useDispatch } from 'react-redux';
import { setInitData } from '@data/init/actions';
import { loadUser } from '@data/user/actions';
import { Alert } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthParamList } from '../types';
import { ShouldStartLoadRequest } from 'react-native-webview/lib/WebViewTypes';
import { ActivityIndicator } from '@components/ActivityIndicator';
import { ScreenContainer } from '@components/ScreenContainer';
import { SafeAreaView } from 'react-native-safe-area-context';
import URL from 'url-parse';
import { YoccoError } from '@services/error';

type Props = StackScreenProps<AuthParamList, 'Modal'>;

export function Modal({ navigation }: Props) {
  const [isWebViewShown, showWebView] = React.useState<boolean>(true);
  const [isSpinnerShown, showSpinner] = React.useState<boolean>(true);

  const dispatch = useDispatch();
  const uri = Auth.getFacebookAuthPageUrl();

  const finish = async (error: string | boolean, url?: string) => {
    showWebView(false);
    try {
      if (!url || error) {
        throw new Error();
      }
      const { jwt } = await Auth.finishFacebookAuth(url);
      if (jwt) {
        dispatch(setInitData({ jwt }));
        dispatch(loadUser());
      }
    } catch (err) {
      let errorMsg = 'Что-то пошло не так';
      if (err instanceof YoccoError) {
        errorMsg = err.message;
      } else if (typeof error === 'string') {
        errorMsg = error;
      }
      Alert.alert(errorMsg, 'Попробуйте ещё раз', [
        {
          text: 'Ok',
          onPress: () => {
            navigation.navigate('Login');
          },
        },
      ]);
    }
    showSpinner(false);
  };

  // Hide spinner if loaded content has Title (facebook auth form)
  const handleNavigationStateChange = (event: WebViewNavigation) => {
    if (isSpinnerShown && event.title) {
      showSpinner(false);
    } else if (!isSpinnerShown && !event.title) {
      showSpinner(true);
    }
  };

  // stop redirects chain to get jwt in the response body using axios
  const onShouldStartLoadWithRequest = (request: ShouldStartLoadRequest): boolean => {
    if (request.url.includes('/auth/facebook/callback?code=')) {
      finish(false, request.url);
      return false;
    }
    return true;
  };

  return (
    <ScreenContainer as={SafeAreaView}>
      {isWebViewShown && (
        <WebView
          incognito
          source={{ uri }}
          style={{ flex: 1 }}
          onNavigationStateChange={handleNavigationStateChange}
          onHttpError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            let error: boolean | string = true;
            if (nativeEvent.statusCode === 401) {
              const { query } = new URL(nativeEvent.url, true);
              if (query?.error_reason === 'user_denied') {
                error = 'Для работы приложения необходимо войти через Facebook';
              }
            }
            finish(error);
          }}
          onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        />
      )}
      {isSpinnerShown && <ActivityIndicator />}
    </ScreenContainer>
  );
}
