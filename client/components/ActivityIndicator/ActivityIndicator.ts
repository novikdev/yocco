import { theme } from '@services/theme';
import styled from 'styled-components/native';

export const ActivityIndicator = styled.ActivityIndicator`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;
`;

ActivityIndicator.defaultProps = {
  color: theme.colors.darkPurple,
  size: 'large',
};
