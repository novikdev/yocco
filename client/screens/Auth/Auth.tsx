import * as React from 'react';
import { AuthParamList } from './types';

import { createStackNavigator } from '@react-navigation/stack';
import { Login } from './subscreens/Login';
import { Modal } from './subscreens/Modal';

const AuthStack = createStackNavigator<AuthParamList>();

export const Auth: React.FC = () => {
  return (
    <AuthStack.Navigator headerMode="none" mode="modal" screenOptions={{ animationEnabled: false }}>
      <AuthStack.Screen name="Login" component={Login} options={{ headerTitle: 'Login' }} />
      <AuthStack.Screen name="Modal" component={Modal} options={{ animationEnabled: true }} />
    </AuthStack.Navigator>
  );
};
