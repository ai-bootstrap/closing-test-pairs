import { FlashList } from '@shopify/flash-list';
import { Link, Stack, useFocusEffect, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native'; // Import ActivityIndicator for the loading spinner

import { useAppFormByUserId } from '@/api/supabase/use-app-forms';
import { useGetMyTestings } from '@/api/supabase/use-testings';
import {
  Button,
  EmptyList,
  FocusAwareStatusBar,
  Pressable,
  Text,
  View,
} from '@/components/ui';
import { setCurrentEditingTesting } from '@/store/testings';
import { useUserInfo } from '@/store/user';
import { type AppFormType } from '@/types';

import { TestingItem } from '../../components/testings/item';

export default function Testings() {
  const userInfo = useUserInfo();
  const router = useRouter();

  const { data, isPending, isError, refetch } = useAppFormByUserId({
    variables: { uid: userInfo!.uid },
  });
  const {
    data: myTestings,
    mutate: getMyTestings,
    isPending: isLoadingMyTestings,
  } = useGetMyTestings();

  const [items, setItems] = useState<AppFormType[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Use useFocusEffect to refetch data when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      refetch();
      getMyTestings(userInfo!.uid);
    }, [refetch])
  );

  useEffect(() => {
    if (isPending || isLoadingMyTestings) {
      return; // Don't update items if data is still loading
    }
    const res = [];
    if (data) {
      res.push(...data);
    }
    if (myTestings?.length) {
      res.push(...myTestings);
    }
    setItems(res); // Update the items state with the new data
  }, [data, myTestings, isLoadingMyTestings, isPending]);

  function handleEdit(item: AppFormType) {
    // Handle the edit action here, e.g., nav
    setCurrentEditingTesting(item);
    console.log('item: ', item);
    router.push(`/testings/edit/${item.id}`); // Navigate to the edit screen with the item ID
  }

  const renderItem = React.useCallback(
    ({ item }: { item: AppFormType }) => (
      <TestingItem
        handleEdit={() => handleEdit(item)}
        {...item}
        from="testings"
      />
    ),
    []
  );

  const loadMoreData = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      // Simulate fetching more data (you should replace this with your actual data fetching logic)
    } catch (error) {
      console.error('Error fetching more data:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      // Refetch data
      await Promise.all([refetch(), getMyTestings(userInfo!.uid)]); // Wait for both refetch and getMyTestings to complete
      const res = [];
      if (data) {
        res.push(...data);
      }
      if (myTestings?.length) {
        res.push(...myTestings);
      }
      setItems(res); // Update the items state with the new data
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refetch, data]);

  // Render a loading spinner while data is being fetched
  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4">Loading data...</Text>
      </View>
    );
  }

  // Render an error message if there is an error
  if (isError) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Error Loading data</Text>
        <Pressable onPress={() => refetch()} className="mt-4">
          <Text className="text-primary-300">Retry</Text>
        </Pressable>
      </View>
    );
  }

  const NoTestings = () => {
    return (
      <View>
        <Button onPress={() => router.push('/testings/add')} label="Add Now" />
      </View>
    );
  };

  // Render the list of items
  return (
    <View className="flex-1">
      <Stack.Screen
        options={{ title: 'Testings', headerRight: () => <AddApp /> }}
      />
      <FocusAwareStatusBar />
      <FlashList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id!.toString()}
        ListEmptyComponent={
          <EmptyList
            message="You have no apps in testing"
            renderCustomContent={() => <NoTestings />}
            isLoading={isPending || isLoadingMyTestings}
          />
        }
        estimatedItemSize={300}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <View className="mt-4 flex-1 items-center justify-center">
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
