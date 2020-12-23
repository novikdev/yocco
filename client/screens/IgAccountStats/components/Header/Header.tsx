import { Avatar } from '@components/Avatar';
import { IInstagramAccount } from '@services/api/instagram-accounts';
import React from 'react';
import { Text } from '@components/Text';
import styled from 'styled-components/native';
import { StyleProp, View, ViewStyle } from 'react-native';

type Props = {
  igAccount: Pick<IInstagramAccount, 'id' | 'username' | 'profilePicture'>;
  style?: StyleProp<ViewStyle>;
};

export function Header(props: Props) {
  return (
    <View style={props.style}>
      <Avatar source={{ uri: props.igAccount.profilePicture }} size="medium" />
      <View style={{ flexDirection: 'column', marginLeft: 10 }}>
        <Text size="h4">{props.igAccount.username}</Text>
        <Text size="h5">подписчики</Text>
      </View>
    </View>
  );
}

export default styled(Header)`
  padding: 10px;
  flex: 0 0 64px;
  align-items: center;
  flex-direction: row;
`;
