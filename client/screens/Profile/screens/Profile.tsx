import React from 'react';
import { Linking, ScrollView, View } from 'react-native';
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
import { SectionTitle } from '../components/SectionTitle';
import { config } from '@services/config';

export function Profile() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const user = useSelector(selectUser)!;
  return (
    <ScreenContainer safeArea="top">
      <ScrollView>
        <ProfileHeader>
          <Avatar size="large" source={{ uri: user.defaultInstagramAccount?.profilePicture }} />
          <View style={{ marginLeft: 20 }}>
            <Text size="h2">{`${user.name} ${user.surname}`}</Text>
            <Text size="h4">{user.email}</Text>
          </View>
        </ProfileHeader>

        <SectionTitle>Настройки аккаунта</SectionTitle>
        <MenuItem onPress={() => navigation.navigate('SelectDefaultIgAccount')}>
          <Text size="h4">Аккаунт по умолчанию</Text>
        </MenuItem>

        <SectionTitle>Поддержка</SectionTitle>
        <MenuItem onPress={() => Linking.openURL(config.SUPPORT_TELEGRAM_URL)}>
          <Text size="h4">Телеграм</Text>
        </MenuItem>
        <MenuItem onPress={() => Linking.openURL(config.SUPPORT_WHATSAPP_URL)}>
          <Text size="h4">WhatsApp</Text>
        </MenuItem>

        <SectionTitle></SectionTitle>
        <MenuItem onPress={() => dispatch(logout({ silent: false }))}>
          <Text size="h4">Выйти</Text>
        </MenuItem>

        <ProfileFooter>
          <Text color={theme.colors.darkGrey}>Версия {config.VERSION}</Text>
        </ProfileFooter>
      </ScrollView>
    </ScreenContainer>
  );
}
