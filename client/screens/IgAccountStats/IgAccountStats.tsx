import * as React from 'react';

import { useSelector } from 'react-redux';
import { selectDefaultIgAccount } from '@data/user/selectors';
import { ScreenContainer } from '@components/ScreenContainer';
import { useNavigation } from '@react-navigation/native';
import { Text } from '@components/Text';
import { SafeAreaView } from 'react-native-safe-area-context';


export function IgAccountStats() {
  const navigation = useNavigation();
  const instagramAccount = useSelector(selectDefaultIgAccount);

  React.useEffect(() => {
    if (!instagramAccount) {
      navigation.navigate('SelectDefaultIgAccountModal');
    }
  }, [instagramAccount]);

  // TODO: handle LoadingStatus.Fail
  return (
    <ScreenContainer as={SafeAreaView}>
      <Text>{JSON.stringify(instagramAccount)}</Text>
    </ScreenContainer>
  );
}
