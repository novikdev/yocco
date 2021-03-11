import React from 'react';
import { getDeltaColor } from './services/getDeltaColor';
import { toStringWithSign } from '../../services/toStringWithSign';
import { Text } from '@components/Text';

type Props = {
  value: number;
  size?: React.ComponentProps<typeof Text>['size'];
  defaultColor?: string;
};

export function Delta(props: Props) {
  const { size = 'body' } = props;
  const delta = toStringWithSign(props.value);
  return (
    <Text size={size} color={getDeltaColor(delta, props.defaultColor)}>
      {delta}
    </Text>
  );
}
