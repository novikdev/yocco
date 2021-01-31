import React from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from '@components/Text';

import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '@data/user/selectors';
import { ScreenContainer } from '@components/ScreenContainer';
import { theme } from '@services/theme';
import { Avatar } from '@components/Avatar';
import { MenuItem } from '../components/MenuItem';
import { ProfileHeader } from '../components/ProfileHeader';
import { ProfileFooter } from '../components/ProfileFooter';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { logout } from '@data/init/actions';

export function Profile() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const user = useSelector(selectUser)!;
  return (
    <ScreenContainer as={SafeAreaView}>
      <ScrollView>
        <ProfileHeader>
          <Avatar size="large" source={{ uri: user.defaultInstagramAccount?.profilePicture }} />
          <View style={{ marginLeft: 20 }}>
            <Text size="h2">{`${user.name} ${user.surname}`}</Text>
            <Text size="h4">{user.email}</Text>
          </View>
        </ProfileHeader>
        <MenuItem onPress={() => navigation.navigate('SelectDefaultIgAccount')}>
          <Text size="h4">Аккаунт по умолчанию</Text>
        </MenuItem>
        <MenuItem onPress={() => dispatch(logout({ silent: false }))}>
          <Text size="h4">Выйти</Text>
        </MenuItem>
        <ProfileFooter>
          <Text color={theme.colors.darkGrey}>Версия 0.1.0</Text>
        </ProfileFooter>
      </ScrollView>
    </ScreenContainer>
  );
}
