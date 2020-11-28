import * as React from 'react';

import { View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { theme } from '@services/theme';

type CheckIconProps = {
  checked: boolean;
};

export function CheckIcon({ checked = false }: CheckIconProps) {
  const color = checked ? theme.colors.darkPurple : theme.colors.lightGrey;
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <FontAwesome
        name="check-circle"
        size={24}
        color={color}
        styles={{ flex: 1, alignSelf: 'center' }}
      />
    </View>
  );
}
