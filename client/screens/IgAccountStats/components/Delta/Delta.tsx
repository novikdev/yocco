import React from 'react';
import { getDeltaColor } from './services/getDeltaColor';
import { toStringWithSign } from '../../services/toStringWithSign';
import { Text } from '@components/Text';
import { theme } from '@services/theme';

type Props = {
  value: number | null;
  size?: React.ComponentProps<typeof Text>['size'];
  defaultColor?: string;
};

export function Delta(props: Props) {
  const { size = 'body' } = props;
  const delta = typeof props.value === 'number' ? toStringWithSign(props.value) : '-';
  const color =
    typeof props.value === 'number' ? getDeltaColor(delta, props.defaultColor) : theme.colors.black;
  return (
    <Text size={size} color={color}>
      {delta}
    </Text>
  );
}
