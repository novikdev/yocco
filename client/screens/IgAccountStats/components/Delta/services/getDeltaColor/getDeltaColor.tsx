import { theme } from '@services/theme';

export const getDeltaColor = (
  delta: string,
  defaultColor: string = theme.colors.black,
  plusColor: string = 'green',
  minusColor: string = 'red'
): string => {
  if (delta.startsWith('-')) {
    return minusColor;
  }
  if (delta.startsWith('+')) {
    return plusColor;
  }
  return defaultColor;
};
