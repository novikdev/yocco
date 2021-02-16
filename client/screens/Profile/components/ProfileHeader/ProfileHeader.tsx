import { theme } from '@services/theme';
import styled from 'styled-components/native';

export const ProfileHeader = styled.View`
  display: flex;
  height: 128px;
  width: 100%;
  margin-bottom: 24px;
  align-items: center;
  flex-direction: row;
  padding: 24px;
  border-bottom-width: 2px;
  border-bottom-color: ${theme.colors.lightGrey};
  background-color: ${theme.colors.lightPurple};
`;
