import { theme } from '@services/theme';
import React from 'react';
import { Text } from '@components/Text';
import styled from 'styled-components/native';
import { IHourIgAccountStats } from '@services/api/instagram-accounts';
import { format } from '@services/dates/format';
import { Delta } from '../Delta';
import { Column } from '../Column';

type Props = {
  stats: IHourIgAccountStats;
};

function SectionItem({ stats }: Props) {
  const time = format(new Date(stats.datetime), 'H:00');
  const returnedFollowersCount = stats.unfollowsCount < 0 ? stats.unfollowsCount * -1 : 0;
  const unfollowDelta = (stats.unfollowsCount + returnedFollowersCount) * -1;
  const followDelta = stats.followsCount + returnedFollowersCount;
  return (
    <SectionItemContainer>
      <Column width={50}>
        <Text size="body" color={theme.colors.black}>
          {time}
        </Text>
      </Column>
      <Column>
        <Delta value={stats.deltaFollowersCount} />
      </Column>
      <Column>
        <Delta value={followDelta} />
      </Column>
      <Column>
        <Delta value={unfollowDelta} />
      </Column>
      <Column width={90}>
        <Text size="body" color={theme.colors.black}>
          {stats.totalFollowersCount}
        </Text>
      </Column>
    </SectionItemContainer>
  );
}

export const SectionItemContainer = styled.View`
  height: 36px;
  justify-content: space-between;
  flex-grow: 5;
  flex-direction: row;
`;

export default React.memo(SectionItem);
