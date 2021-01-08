import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Profile as ProfileScreen } from './screens/Profile';

export type ProfileParamList = {
  Profile: undefined;
};

const ProfileStack = createStackNavigator<ProfileParamList>();

export function Profile() {
  return (
    <ProfileStack.Navigator initialRouteName="Profile">
      <ProfileStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          headerTitle: 'Профиль',
        }}
      />
    </ProfileStack.Navigator>
  );
}
