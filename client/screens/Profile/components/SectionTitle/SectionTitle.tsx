import { theme } from '@services/theme';
import React from 'react';
import styled from 'styled-components/native';
import { Text } from '@components/Text';

type Props = React.PropsWithChildren<{}>;

export function SectionTitle(props: Props) {
  return (
    <SectionTitleContent>
      <Text size="h5" color="grey" style={{ textTransform: 'uppercase' }}>
        {props.children}
      </Text>
    </SectionTitleContent>
  );
}

const SectionTitleContent = styled.View`
  display: flex;
  height: 48px;
  color: ${theme.colors.white};
  margin-left: 24px;
  margin-right: 24px;
  justify-content: flex-end;
`;
