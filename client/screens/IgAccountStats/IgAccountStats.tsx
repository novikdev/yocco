import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { selectDefaultIgAccount } from '@data/user/selectors';
import { ScreenContainer } from '@components/ScreenContainer';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SectionList } from 'react-native';
import { selectIgAccountStats, selectIgAccountStatsStatus } from '@data/igAccountStats/selectors';
import { SectionHeader } from './components/SectionHeader';
import { SectionItem } from './components/SectionItem';
import { ListItemSeparator } from '@components/ListItemSeparator';
import { loadIgAccountStats, loadPrevIgAccountStats } from '@data/igAccountStats/actions';
import { isLoading } from '@services/isLoading';
import { LoadingStatus } from '@data/types';
import { Header } from './components/Header';
import { ListTitle } from './components/ListTitle';

export function IgAccountStats() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const igAccount = useSelector(selectDefaultIgAccount);
  const stats = useSelector(selectIgAccountStats);
  const status = useSelector(selectIgAccountStatsStatus);

  React.useEffect(() => {
    if (!igAccount) {
      navigation.navigate('SelectDefaultIgAccountModal');
    } else {
      dispatch(loadIgAccountStats(igAccount.id));
    }
  }, [igAccount]);

  if (!igAccount) {
    return null;
  }

  return (
    <ScreenContainer as={SafeAreaView}>
      <Header igAccount={igAccount} />
      <ListTitle />
      <SectionList
        style={{ flex: 1, paddingLeft: 10, paddingRight: 10 }}
        sections={stats}
        initialNumToRender={20}
        onRefresh={() => {
          if (!isLoading(status)) {
            dispatch(loadIgAccountStats(igAccount.id));
          }
        }}
        refreshing={status === LoadingStatus.Loading}
        keyExtractor={({ datetime }) => datetime}
        onEndReached={() => {
          if (!isLoading(status)) {
            dispatch(loadPrevIgAccountStats(igAccount.id));
          }
        }}
        onEndReachedThreshold={0.7}
        renderSectionHeader={({ section }) => (
          <SectionHeader date={section.day.date} delta={section.day.delta} />
        )}
        renderItem={({ item }) => <SectionItem stats={item} />}
        ItemSeparatorComponent={ListItemSeparator}
      />
    </ScreenContainer>
  );
}
