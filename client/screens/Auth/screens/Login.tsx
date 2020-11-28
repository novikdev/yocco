import * as React from 'react';
import { Button } from 'react-native';
import styled from 'styled-components/native';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthParamList } from '../types';

type Props = StackScreenProps<AuthParamList, 'Login'>;

export function Login({ navigation }: Props) {
  const handleOnLogIn = () => {
    navigation.navigate('Modal');
  };

  return (
    <Container>
      <Title>Login Screen</Title>
      <Button
        onPress={handleOnLogIn}
        title="Login"
        color="#841584"
        accessibilityLabel="Login using Facebook"
      />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
`;
