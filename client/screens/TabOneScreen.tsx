import * as React from 'react';
import { StyleSheet } from 'react-native';

import { Text, View } from '@components/Themed';
import { useSelector } from 'react-redux';
import { selectUser } from '@data/init/selectors';

export default function TabOneScreen() {
  const user = useSelector(selectUser)!;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello, {user.email}!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
