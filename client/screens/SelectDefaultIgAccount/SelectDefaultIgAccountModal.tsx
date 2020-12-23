import React from 'react';
import { SelectDefaultIgAccount } from './components/SelectDefaultIgAccount';
import { ScreenContainer } from '@components/ScreenContainer';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@services/theme';

export function SelectDefaultIgAccountModal() {
  return (
    <ScreenContainer as={SafeAreaView} bgColor={theme.colors.bgColor}>
      <SelectDefaultIgAccount firstTime />
    </ScreenContainer>
  );
}
