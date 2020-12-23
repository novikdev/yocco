import styled from 'styled-components/native';

type Props = {
  width?: number;
};

export const Column = styled.View<Props>`
  flex: 1;
  ${({ width }) =>
    width &&
    `flex: 0 0 ${width}px;
     width: ${width}px;`}
  justify-content: center;
  align-items: flex-end;
`;
