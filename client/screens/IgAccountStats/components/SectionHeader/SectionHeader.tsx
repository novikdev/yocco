import { theme } from '@services/theme';
import React from 'react';
import { View } from 'react-native';
import { Text } from '@components/Text';
import { format } from '@services/dates/format';
import styled from 'styled-components/native';
import { Delta } from '../Delta';

type Props = {
  date: string;
  delta: number;
};

function SectionHeader(props: Props) {
  const title = format(new Date(props.date), 'PP');
  return (
    <SectionHeaderContainer>
      <View>
        <Text size="h5" color={theme.colors.darkGrey}>
          {title}
        </Text>
      </View>
      <View>
        <Delta size="h5" value={props.delta} defaultColor={theme.colors.darkGrey} />
      </View>
    </SectionHeaderContainer>
  );
}

export const SectionHeaderContainer = styled.View`
  flex: 1 1 auto;
  flex-direction: row;
  justify-content: space-between;
  height: 32px;
  background-color: ${theme.colors.lightGrey};
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 5px;
  align-items: center;
`;

export default React.memo(SectionHeader);
