import { FlashList } from '@shopify/flash-list';
import React from 'react';

import { useAllAppForms } from '@/api/supabase/use-app-forms';
import BannerAdUnit from '@/components/adunits/banner';
import { EmptyList, Text, View } from '@/components/ui';
import { type AppFormType } from '@/types';

import { TestingItem } from '../../components/testings/item';
export default function Feed() {
  const { data, isPending, isError, refetch } = useAllAppForms();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch?.();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const renderItem = React.useCallback(
    ({ item }: { item: AppFormType }) => (
      <TestingItem key={item.id} {...item} from="all" />
    ),
    []
  );

  if (isError) {
    return (
      <View>
        <Text> Error Loading data </Text>
      </View>
    );
  }
  return (
    // <SafeAreaView  edges={['left']} className="bg-primary-900 rounded-b-3xl flex-1">
    <View className="flex-1 overflow-y-scroll bg-gray-100">
      {/* <FocusAwareStatusBar hidden={true} /> */}
      <View className="mt-24 flex-1 pt-16">
        <FlashList
          data={data}
          renderItem={renderItem}
          keyExtractor={(_, index) => `item-${index}`}
          ListEmptyComponent={<EmptyList isLoading={isPending} />}
          estimatedItemSize={300}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
        <BannerAdUnit />
      </View>
    </View>
  );
}
