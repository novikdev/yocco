import styled from 'styled-components/native';

const IMAGE_SIZES: Record<AvatarSize, string> = {
  small: '20px',
  medium: '50px',
  large: '100px',
};

type AvatarSize = 'small' | 'medium' | 'large';

type Props = {
  size?: AvatarSize;
};

export const Avatar = styled.Image<Props>`
  width: ${({ size }) => IMAGE_SIZES[size!]};
  height: ${({ size }) => IMAGE_SIZES[size!]};
  border-radius: ${({ size }) => IMAGE_SIZES[size!]};
`;

Avatar.defaultProps = {
  size: 'medium',
};
