import styled from 'styled-components/native';
import { theme } from '@services/theme';

export const Title = styled.Text`
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: center;
  font-weight: bold;
  font-size: 25px;
  color: ${theme.colors.black};
`;

export const Subtitle = styled.Text`
  text-align: center;
  color: ${theme.colors.darkGrey};
  margin-bottom: 20px;
`;

export const Text = styled.Text`
  color: ${theme.colors.black};
  font-size: 18px;
`;
