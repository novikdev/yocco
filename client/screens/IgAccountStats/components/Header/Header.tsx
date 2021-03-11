import { Avatar } from '@components/Avatar';
import { IInstagramAccount } from '@services/api/instagram-accounts';
import React from 'react';
import { Text } from '@components/Text';
import styled from 'styled-components/native';
import { StyleProp, View, ViewStyle } from 'react-native';
import { selectIgAccountTempStats } from '@data/igAccountStats/selectors';
import { useSelector } from 'react-redux';
import { toStringWithSign } from '../../services/toStringWithSign';

type Props = {
  igAccount: Pick<IInstagramAccount, 'id' | 'username' | 'profilePicture'>;
  style?: StyleProp<ViewStyle>;
};

export function Header(props: Props) {
  const stats = useSelector(selectIgAccountTempStats);
  return (
    <View style={props.style}>
      <View style={{ flexDirection: 'row' }}>
        <Avatar source={{ uri: props.igAccount.profilePicture }} size="medium" />
        <View style={{ flexDirection: 'column', marginLeft: 10 }}>
          <Text size="h4">{props.igAccount.username}</Text>
          <Text size="h5">подписчики</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'column', marginLeft: 10, alignItems: 'flex-end' }}>
        {stats ? (
          <>
            <View>
              <Text size="h4">{stats.totalFollowersCount}</Text>
            </View>
            <View>
              <Text size="h5">
                <Text size="h5" color="blue">
                  {toStringWithSign(stats.deltaFollowersCount)}
                </Text>
                {' ('}
                <Text size="h5" color="green">
                  {toStringWithSign(stats.followsCount)}
                </Text>
                /
                <Text size="h5" color="red">
                  {toStringWithSign(stats.unfollowsCount)}
                </Text>
                {')'}
              </Text>
            </View>
          </>
        ) : (
          <Text size="h5">...</Text>
        )}
      </View>
    </View>
  );
}

export default styled(Header)`
  padding: 10px;
  flex: 0 0 64px;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
`;
