import { FlashList } from '@shopify/flash-list';
import React from 'react';
 
import { Card } from '@/components/card';
import { EmptyList, FocusAwareStatusBar, Text, View } from '@/components/ui';
import { useAllAppForms } from '@/api/supabase/use-save-app-forms';
import { AppFormType } from '@/types'
import { TestingItem } from '../testings/item';
import { router } from 'expo-router';
import { Alert, Pressable, StatusBar } from 'react-native'; 
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

  function handleAddToTesting(item: AppFormType) {
    Alert.alert(
      'Add to Testing',
      'Are you sure you want to add this app to testing?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            // Handle the action when the user confirms
            console.log('App added to testing:', item);
            router.push(`/testings/${item.id}`); // Navigate to the testing screen with the item ID
          },
        },
      ],
      { cancelable: true }
    );
  }

  const renderItem = React.useCallback(
    ({ item }: { item: AppFormType }) => <TestingItem  {...item} addToTesting={()=>handleAddToTesting(item)} handleEdit={()=>handleAddToTesting(item)} from='all' />,
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
