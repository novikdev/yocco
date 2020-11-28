import * as React from 'react';
import { ScreenContainer } from '@components/ScreenContainer';
import { SelectDefaultIgAccount } from './components/SelectDefaultIgAccount';
import { theme } from '@services/theme';

export function SelectDefaultIgAccountScreen() {
  return (
    <ScreenContainer bgColor={theme.colors.bgColor}>
      <SelectDefaultIgAccount />
    </ScreenContainer>
  );
}
