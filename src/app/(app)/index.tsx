import { FlashList } from '@shopify/flash-list';
import React from 'react';
  
import { EmptyList, FocusAwareStatusBar, Text, View } from '@/components/ui';
import { useAllAppForms } from '@/api/supabase/use-save-app-forms';
import { AppFormType } from '@/types'
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
    ({ item }: { item: AppFormType }) => <TestingItem  
      key={item.id}
      id={item.id}
      {...item}  from='all' />,
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
    <View className="flex-1 bg-gray-100 overflow-y-scroll">
      {/* <FocusAwareStatusBar hidden={true} /> */} 
      <View className='mt-24 pt-16 flex-1'>
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
