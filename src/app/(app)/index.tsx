import { FlashList } from '@shopify/flash-list';
import React from 'react';
 
import { Card } from '@/components/card';
import { EmptyList, FocusAwareStatusBar, Text, View } from '@/components/ui';
import { useAllAppForms } from '@/api/supabase/use-save-app-forms';
import { AppFormType } from '@/types'
import { TestingItem } from '../testings/item';

export default function Feed() {
  const { data, isPending, isError } = useAllAppForms();

  const renderItem = React.useCallback(
    ({ item }: { item: AppFormType }) => <TestingItem  {...item} from='all' />,
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
    <View className="flex-1 ">
      <FocusAwareStatusBar />
      <FlashList
        data={data}
        renderItem={renderItem}
        keyExtractor={(_, index) => `item-${index}`}
        ListEmptyComponent={<EmptyList isLoading={isPending} />}
        estimatedItemSize={300}
      />
    </View>
  );
}
