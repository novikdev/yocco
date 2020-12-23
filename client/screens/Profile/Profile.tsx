import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Profile as ProfileScreen } from './screens/Profile';
import { SelectDefaultIgAccount } from '../SelectDefaultIgAccount';

export type ProfileParamList = {
  Profile: undefined;
  SelectDefaultIgAccount: undefined;
};

const ProfileStack = createStackNavigator<ProfileParamList>();

export function Profile() {
  return (
    <ProfileStack.Navigator initialRouteName="Profile">
      <ProfileStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false, headerTitle: 'Профиль' }}
      />
      <ProfileStack.Screen
        name="SelectDefaultIgAccount"
        component={SelectDefaultIgAccount.Screen}
        options={{
          headerTitle: '',
        }}
      />
    </ProfileStack.Navigator>
  );
}
