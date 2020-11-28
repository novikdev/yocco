import * as React from 'react';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { Auth } from '@services/api/auth';
import { useDispatch } from 'react-redux';
import { loadUser, setInitData } from '@data/init/actions';
import { View, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthParamList } from '../types';
import { ShouldStartLoadRequest } from 'react-native-webview/lib/WebViewTypes';

type Props = StackScreenProps<AuthParamList, 'Modal'>;

export function Modal({ navigation }: Props) {
  const [isWebViewShown, showWebView] = React.useState<boolean>(true);
  const [isSpinnerShown, showSpinner] = React.useState<boolean>(true);

  const dispatch = useDispatch();
  const uri = Auth.getFacebookAuthPageUrl();

  const finish = async (url?: string) => {
    showWebView(false);
    try {
      if (!url) {
        throw new Error();
      }
      const { jwt } = await Auth.finishFacebookAuth(url);
      if (jwt) {
        dispatch(setInitData({ jwt }));
        dispatch(loadUser());
      }
    } catch (err) {
      Alert.alert('Sorry, something went wrong', 'Please try again', [
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
      finish(request.url);
      return false;
    }
    return true;
  };

  return (
    <View style={{ flex: 1 }}>
      {isWebViewShown && (
        <WebView
          source={{ uri }}
          style={{ marginTop: 50, flex: 1 }}
          onNavigationStateChange={handleNavigationStateChange}
          onHttpError={() => finish()}
          onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        />
      )}
      {isSpinnerShown && <ActivityIndicator style={styles.loading} size="large" />}
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
