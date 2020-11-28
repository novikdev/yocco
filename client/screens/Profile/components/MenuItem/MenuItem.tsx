import { theme } from '@services/theme';
import React from 'react';
import { TouchableHighlight } from 'react-native';
import styled from 'styled-components/native';

type Props = React.PropsWithChildren<{
  onPress(): void;
}>;

export function MenuItem(props: Props) {
  return (
    <TouchableHighlight onPress={props.onPress} underlayColor={theme.colors.lightGrey}>
      <MenuItemContent>{props.children}</MenuItemContent>
    </TouchableHighlight>
  );
}

const MenuItemContent = styled.View`
  flex: 1;
  height: 64px;
  color: ${theme.colors.white};
  border-bottom-width: 2px;
  border-bottom-color: ${theme.colors.lightGrey};
  margin-left: 24px;
  margin-right: 24px;
  justify-content: center;
`;
