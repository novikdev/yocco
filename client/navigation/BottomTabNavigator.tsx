import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Profile } from '../screens/Profile';

import { IgAccountStats } from '../screens/IgAccountStats';
import { BottomTabParamList } from '../types';
import { theme } from '@services/theme';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      initialRouteName="IgAccountStats"
      tabBarOptions={{ activeTintColor: theme.colors.darkPurple }}
    >
      <BottomTab.Screen
        name="IgAccountStats"
        component={IgAccountStats}
        options={{
          title: 'Статистика',
          tabBarIcon: ({ color }) => <TabBarIcon name="md-stats" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={Profile}
        options={{
          title: 'Профиль',
          tabBarIcon: ({ color }) => <TabBarIcon name="md-contact" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: string; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}
