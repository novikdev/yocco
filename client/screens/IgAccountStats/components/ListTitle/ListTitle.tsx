import React from 'react';
import { Text } from '@components/Text';
import styled from 'styled-components/native';
import { Column } from '../Column';
import { theme } from '@services/theme';
import { StyleProp, View } from 'react-native';
import { ViewStyle } from 'react-native';

type Props = {
  style?: StyleProp<ViewStyle>;
};

function ListTitle(props: Props) {
  return (
    <View style={props.style}>
      <Column width={50}>
        <Text size="body" color={theme.colors.black}>
          Время
        </Text>
      </Column>
      <Column>
        <Text size="body" color={theme.colors.black}>
          Δ
        </Text>
      </Column>
      <Column>
        <Text size="body" color="green">
          +
        </Text>
      </Column>
      <Column>
        <Text size="body" color="red">
          -
        </Text>
      </Column>
      <Column width={90}>
        <Text size="body" color={theme.colors.black}>
          Всего
        </Text>
      </Column>
    </View>
  );
}

export default styled(ListTitle)`
  padding-left: 10px;
  padding-right: 10px;
  height: 28px;
  flex-direction: row;
`;
