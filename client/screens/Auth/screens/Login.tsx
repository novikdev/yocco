import React from 'react';
import styled from 'styled-components/native';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthParamList } from '../types';
import { Text } from '@components/Text';
import { Linking, SafeAreaView, View, Image, FlatList } from 'react-native';
import { ScreenContainer } from '@components/ScreenContainer';
import { config } from '@services/config';
import { Ionicons } from '@expo/vector-icons';
import logo from '../../../assets/images/icon.png';
import { theme } from '@services/theme';

type Props = StackScreenProps<AuthParamList, 'Login'>;

// prettier-ignore
const features = [
  'Почасовая статистика подписок и отписок',
  'Добавление нескольких аккаунтов'
];

export function Login({ navigation }: Props) {
  const handleOnLogIn = () => {
    navigation.navigate('Modal');
  };

  return (
    <ScreenContainer
      as={SafeAreaView}
      style={{
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <View style={{ display: 'flex', height: '15%' }} />
      <View style={{ height: '70%', width: '100%', padding: 20 }}>
        <Image
          source={logo}
          style={{
            width: 128,
            height: 128,
            marginVertical: 30,
          }}
        />
        <Text color="black" bold={true} size="h4">
          Аналитика подписчиков
          {'\n'}
          Instagram аккаунтов
        </Text>
        <FlatList
          data={features}
          style={{ marginVertical: 30 }}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <Ionicons
                name="ios-checkmark-circle"
                size={24}
                color={theme.colors.darkPurple}
                style={{ marginRight: 10 }}
              />
              <Text size="body">{item}</Text>
            </View>
          )}
        />
        <View style={{ alignItems: 'center' }}>
          <FacebookButton onPress={handleOnLogIn}>
            <Ionicons name="logo-facebook" size={24} color="white" style={{ marginRight: 10 }} />
            <Text color="white" bold={true} size="h5">
              Продолжить с Facebook
            </Text>
          </FacebookButton>
          <Text color="grey" size="body">
            мы не получаем пароли от ваших аккаунтов
          </Text>
        </View>
      </View>
      <View
        style={{
          display: 'flex',
          height: '15%',
          width: '100%',
          justifyContent: 'flex-end',
          alignItems: 'center',
          padding: 20,
        }}
      >
        <Text
          accessibilityRole="link"
          color="grey"
          size="body"
          style={{ textAlign: 'center', textDecorationLine: 'underline' }}
          onPress={() => Linking.openURL(config.AGREEMENT_URL)}
        >
          Политика в отношении
          {'\n'}
          обработки персональных данных
        </Text>
      </View>
    </ScreenContainer>
  );
}

const FacebookButton = styled.TouchableOpacity`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  margin-bottom: 5px;
  flex-direction: row;
  padding: 10px;
  max-width: 350px;
  background-color: #1877f2;
  border-radius: 4px;
`;
