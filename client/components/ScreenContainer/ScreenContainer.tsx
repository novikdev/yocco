import { theme } from '@services/theme';
import styled from 'styled-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

type Props = React.PropsWithChildren<{
  bgColor?: string;
  safeArea?: 'both' | 'top' | 'none';
  style?: StyleProp<ViewStyle>;
}>;

export function ScreenContainer({
  safeArea = 'none',
  bgColor = theme.colors.white,
  ...props
}: Props) {
  const insets = useSafeAreaInsets();
  const paddingTop = ['both', 'top'].includes(safeArea) ? insets.top : 0;
  const paddingBottom = ['both', 'bottom'].includes(safeArea) ? insets.bottom : 0;
  return (
    <ScreenContainerView
      {...props}
      bgColor={bgColor}
      paddingTop={paddingTop}
      paddingBottom={paddingBottom}
    />
  );
}

type ScreenContainerViewProps = {
  bgColor?: string;
  paddingTop?: number;
  paddingBottom?: number;
};

const ScreenContainerView = styled.View<ScreenContainerViewProps>`
  flex: 1;
  padding-top: ${({ paddingTop }) => paddingTop + 'px' ?? 0};
  background-color: ${({ bgColor }) => bgColor};
`;
