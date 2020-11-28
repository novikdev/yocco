import * as React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { selectInstagramAccounts } from '@data/instagramAccounts/selectors';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { CheckIcon } from './components/CheckIcon';
import { Subtitle, Title, Text } from '@components/Title';
import { Avatar } from '@components/Avatar';
import { ListItem } from './components/ListItem';

import { ActivityIndicator } from '@components/ActivityIndicator';
import { loadIgAccounts, setDefaultIgAccount } from '@data/instagramAccounts/actions';
import { isLoading } from '@services/isLoading';
import { theme } from '@services/theme';
import { selectDefaultIgAccount } from '@data/user/selectors';
import { useNavigation } from '@react-navigation/native';

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
