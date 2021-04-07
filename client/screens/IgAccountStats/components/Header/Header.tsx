import { Avatar } from '@components/Avatar';
import { IInstagramAccount } from '@services/api/instagram-accounts';
import React from 'react';
import { Text } from '@components/Text';
import styled from 'styled-components/native';
import { StyleProp, View, ViewStyle } from 'react-native';
import { selectIgAccountTempStats } from '@data/igAccountStats/selectors';
import { useSelector } from 'react-redux';
import { toStringWithSign } from '../../services/toStringWithSign';
import { prepareStatsForDisplaying } from '../../services/prepareStatsForDisplaying';
import { TouchableOpacity } from 'react-native';
import { openExternalIgAccount } from '@services/openExternalIgAccount';

type Props = {
  igAccount: Pick<IInstagramAccount, 'id' | 'username' | 'profilePicture'>;
  style?: StyleProp<ViewStyle>;
};

export function Header(props: Props) {
  const { username } = props.igAccount;
  const openIgAccount = React.useCallback(() => openExternalIgAccount(username), [username]);

  let stats = useSelector(selectIgAccountTempStats);
  stats = stats && prepareStatsForDisplaying(stats);

  return (
    <View style={props.style}>
      <TouchableOpacity style={{ flexDirection: 'row' }} onPress={openIgAccount} activeOpacity={1}>
        <Avatar source={{ uri: props.igAccount.profilePicture }} size="medium" />
        <View style={{ flexDirection: 'column', marginLeft: 10 }}>
          <Text size="h4">{username}</Text>
          <Text size="h5">подписчики</Text>
        </View>
      </TouchableOpacity>
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
                  {toStringWithSign(stats.unfollowsCount * -1)}
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
