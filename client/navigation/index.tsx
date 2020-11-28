import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';
import { useSelector } from 'react-redux';

import { NotFound } from '../screens/NotFound';
import { Auth } from '../screens/Auth';
import { RootStackParamList } from '../types';
import BottomTabNavigator from './BottomTabNavigator';
import LinkingConfiguration from './LinkingConfiguration';
import { selectUser } from '@data/init/selectors';

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  const user = useSelector(selectUser);

  return (
    <Stack.Navigator headerMode="none" mode="modal" screenOptions={{ animationEnabled: false }}>
      {user ? (
        <>
          <Stack.Screen name="Root" component={BottomTabNavigator} />
          <Stack.Screen name="NotFound" component={NotFound} options={{ title: 'Oops!' }} />
        </>
      ) : (
        <Stack.Screen name="Auth" component={Auth} />
      )}
    </Stack.Navigator>
  );
}
