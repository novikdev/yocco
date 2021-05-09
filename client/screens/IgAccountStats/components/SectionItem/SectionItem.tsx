import { theme } from '@services/theme';
import React from 'react';
import { Text } from '@components/Text';
import styled from 'styled-components/native';
import { IHourIgAccountStats } from '@services/api/instagram-accounts';
import { format } from '@services/dates/format';
import { Delta } from '../Delta';
import { Column } from '../Column';
import { prepareStatsForDisplaying } from '../../services/prepareStatsForDisplaying';

type Props = {
  stats: IHourIgAccountStats;
};

function SectionItem(props: Props) {
  const stats = prepareStatsForDisplaying(props.stats);
  const time = format(new Date(stats.datetime), 'H:00');
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
        <Delta value={stats.followsCount} />
      </Column>
      <Column>
        <Delta value={stats.unfollowsCount && stats.unfollowsCount * -1} />
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
