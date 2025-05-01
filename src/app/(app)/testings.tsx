import { FlashList } from '@shopify/flash-list';
import React, { useState, useEffect } from 'react';
import { EmptyList, FocusAwareStatusBar, Pressable, Text, View } from '@/components/ui';
import { useAppFormByUserId } from '@/api/supabase/use-save-app-forms';
import { AppFormType } from '@/types';
import { TestingItem } from '../testings/item';
import { Link, Stack, useFocusEffect, useRouter } from 'expo-router';
import { ActivityIndicator } from 'react-native'; // Import ActivityIndicator for the loading spinner
import { useUserInfo } from '@/store/user';
import { setCurrentEditingTesting } from '@/store/testings';

export default function Testings() {
  const userInfo = useUserInfo();
  const router = useRouter();

  console.log('userInfo111: ', userInfo);

  const { data, isPending, isError, refetch, } = useAppFormByUserId({
    variables: {uid: userInfo!.uid}
  });
  const [items, setItems] = useState<AppFormType[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Use useFocusEffect to refetch data when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch,])
  );

  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data]);

  function handleEdit(item: AppFormType) {
    // Handle the edit action here, e.g., nav 
    setCurrentEditingTesting(item)
    console.log('item: ', item);
    router.push(`/testings/edit/${item.id}`); // Navigate to the edit screen with the item ID
  }

  const renderItem = React.useCallback(
    ({ item }: { item: AppFormType }) => <TestingItem handleEdit={()=>handleEdit(item)} {...item} from='testings' />,
    []
  );

  const loadMoreData = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      // Simulate fetching more data (you should replace this with your actual data fetching logic)
      const newItems = await fetchMoreData(); // Replace with your actual fetch function
      setItems((prevItems) => [...prevItems, ...newItems]);
      if (newItems.length === 0) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching more data:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const fetchMoreData = async () => {
    // Simulate fetching more data
    return new Promise<AppFormType[]>((resolve) => {
      setTimeout(() => {
        resolve([
          // { id: Math.random(), name: 'New Item 1' },
          // { id: Math.random(), name: 'New Item 2' },
          // { id: Math.random(), name: 'New Item 3' },
        ]);
      }, 1000);
    });
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      // Refetch data
      await refetch();
      if(data){
        setItems(data); // Update items with the new data
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refetch, data]);

  // Render a loading spinner while data is being fetched
  if (isPending) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4">Loading data...</Text>
      </View>
    );
  }

  // Render an error message if there is an error
  if (isError) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Error Loading data</Text>
        <Pressable onPress={()=>refetch()} className="mt-4">
          <Text className="text-primary-300">Retry</Text>
        </Pressable>
      </View>
    );
  }

  // Render the list of items
  return (
    <View className="flex-1">
      <Stack.Screen options={{ title: 'Testings', headerRight: () => <AddApp /> }} />
      <FocusAwareStatusBar />
      <FlashList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id!.toString()}
        ListEmptyComponent={<EmptyList isLoading={isPending} />}
        estimatedItemSize={300}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <View className="flex-1 justify-center items-center mt-4">
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : null
        }
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </View>
  );
}

const AddApp = () => {
  return (
    <Link href="/testings/add" asChild>
      <Pressable>
        <Text className="px-3 text-primary-300">Add</Text>
      </Pressable>
    </Link>
  );
};