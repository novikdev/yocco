import { theme } from '@services/theme';
import styled from 'styled-components/native';

const FONT_SIZES: Record<TextSize, string> = {
  h1: '40px',
  h2: '34px',
  h3: '28px',
  h4: '22px',
  h5: '18px',
  body: '16px',
};

type TextSize = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'body';

type Props = {
  size?: TextSize;
  color?: string;
  bold?: boolean;
};

export const Text = styled.Text<Props>`
  font-size: ${({ size }) => FONT_SIZES[size!]};
  color: ${({ color }) => color};
  font-weight: ${({ bold }) => (bold ? 'bold' : 'normal')};
`;

Text.defaultProps = {
  size: 'h4',
  color: theme.colors.black,
};
