import { FlashList } from '@shopify/flash-list';
import React, { useState } from 'react';

import {
  useAllAppForms,
  useAppFormByUserId,
} from '@/api/supabase/use-app-forms';
import { EmptyList, Text, View } from '@/components/ui';
import { useUserInfo } from '@/store/user';
import { type AppFormType } from '@/types';

import { TestingItem } from '../../components/testings/item';
export default function Feed() {
  const userInfo = useUserInfo();

  const { data, isPending, isError, refetch } = useAllAppForms();
  const [refreshing, setRefreshing] = React.useState(false);
  const [list, setList] = useState<AppFormType[]>([]);

  const { data: myTestings } = useAppFormByUserId({
    variables: { uid: userInfo!.uid },
  });
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
      </View>
    </View>
  );
}
