import * as React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { selectInstagramAccounts } from '@data/instagramAccounts/selectors';
import { FlatList, Linking, TouchableOpacity, View } from 'react-native';
import { CheckIcon } from './components/CheckIcon';
import { Subtitle, Title } from '@components/Title';
import { Avatar } from '@components/Avatar';
import { ListItem } from './components/ListItem';

import { ActivityIndicator } from '@components/ActivityIndicator';
import { loadIgAccounts, setDefaultIgAccount } from '@data/instagramAccounts/actions';
import { isLoading } from '@services/isLoading';
import { theme } from '@services/theme';
import { selectDefaultIgAccount } from '@data/user/selectors';
import { useNavigation } from '@react-navigation/native';
import { Text } from '@components/Text';
import { config } from '@services/config';

type Props = {
  firstTime?: boolean;
};

export function SelectDefaultIgAccount(props: Props) {
  const dispatch = useDispatch();
  const navigator = useNavigation();
  const igAccounts = useSelector(selectInstagramAccounts);
  const defaultIgAccount = useSelector(selectDefaultIgAccount);

  React.useEffect(() => {
    dispatch(loadIgAccounts());
  }, []);

  React.useEffect(() => {
    if (props.firstTime && defaultIgAccount) {
      navigator.navigate('IgAccountStats');
    }
  }, [defaultIgAccount]);

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: theme.colors.bgColor }}>
      <Title>Выберите аккаунт по умолчанию</Title>
      {props.firstTime && <Subtitle>позже вы сможете сменить его в настройках</Subtitle>}
      {isLoading(igAccounts.status) ? (
        <ActivityIndicator />
      ) : igAccounts.data.length !== 0 ? (
        <>
          <Text color="black" size="h5">
            У вас нет привязанных аккаунтов Instagram
            {'\n\n'}
            Для успешной привязки аккаунта у вас должен быть бизнес-аккаунт (Business) или аккаунт
            автора (Creator). Он должен быть привязан к странице Facebook
            {'\n\n'}
            Если у вас возникают сложности с привязкой аккаунта, напишите в техническую поддержку:
            {'\n\n'}
          </Text>
          <Text
            accessibilityRole="link"
            color="blue"
            size="h4"
            style={{ textAlign: 'center', textDecorationLine: 'underline' }}
            onPress={() => Linking.openURL(config.SUPPORT_TELEGRAM_URL)}
          >
            Написать в Телеграм{'\n\n'}
          </Text>
          <Text
            accessibilityRole="link"
            color="blue"
            size="h4"
            style={{ textAlign: 'center', textDecorationLine: 'underline' }}
            onPress={() => Linking.openURL(config.SUPPORT_WHATSAPP_URL)}
          >
            Написать в WhatsApp
          </Text>
        </>
      ) : (
        <FlatList
          data={igAccounts.data}
          keyExtractor={({ id }) => id.toString()}
          renderItem={({ item: igAccount }) => (
            <TouchableOpacity
              style={{ marginBottom: 20 }}
              onPress={() => {
                dispatch(setDefaultIgAccount(igAccount.id));
              }}
            >
              <ListItem>
                <Avatar source={{ uri: igAccount.profilePicture }} />
                <ListItem.Content>
                  <Text>{igAccount.username}</Text>
                </ListItem.Content>
                <CheckIcon checked={igAccount.isDefault} />
              </ListItem>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
