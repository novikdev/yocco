import { theme } from '@services/theme';
import styled from 'styled-components/native';

type Props = {
  bgColor?: string;
};

export const ScreenContainer = styled.View<Props>`
  flex: 1;
  background-color: ${({ bgColor }) => bgColor};
`;

ScreenContainer.defaultProps = {
  bgColor: theme.colors.white,
};
