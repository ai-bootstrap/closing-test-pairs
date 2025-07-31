import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  FlatList,
  Platform,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native';

import {
  type ProofSubmissionType,
  useProofSubmissions,
} from '@/api/supabase/use-proof-submission';
import { Image, Text, View } from '@/components/ui';

const CommunityProofsScreen = () => {
  const [refreshing, setRefreshing] = React.useState(false);
  const appId = useLocalSearchParams().id;

  // Sample data - replace with your actual data source
  const { data: todayProofs } = useProofSubmissions({
    variables: {
      app_id: appId as string,
      // created_at: dayjs().format('YYYY-MM-DD'),
    },
  });

  if (!appId) {
    return <Text>No app id</Text>;
  }

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate network request
    setTimeout(() => {
      setRefreshing(false);
      // In a real app, you would fetch new data here
    }, 1500);
  };

  const renderItem = ({ item }: { item: ProofSubmissionType }) => (
    <View className="w-1/2 p-2">
      <View className="overflow-hidden rounded-lg bg-white shadow-sm">
        <Image
          source={{ uri: item.screen_shot }}
          className="aspect-square w-full"
          resizeMode="cover"
        />
        {/* {item.verified && (
          <View className="absolute right-2 top-2 size-6 items-center justify-center rounded-full bg-white">
            <FontAwesome name="check" size={12} color="#10B981" />
          </View>
        )} */}
        <View className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
          <Text className="text-xs font-medium text-white">{item.email}</Text>
          <Text className="text-xs text-white">
            {dayjs(item.created_at).format('HH:mm')}
          </Text>
        </View>
      </View>
    </View>
  );
  const currentDate = dayjs().format('MMM D, YYYY');

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
    >
      <View className="flex-1 p-4">
        {/* Stats Bar */}
        <View className="mb-6 flex-row items-center justify-between rounded-xl bg-white p-3 shadow-sm">
          <View className="flex-row items-center">
            <View className="mr-2 size-3 rounded-full bg-green-500" />
            <Text className="text-sm font-medium">
              {todayProofs?.length} verified
            </Text>
          </View>
          <View className="mr-4 flex-row items-center">
            <FontAwesome
              name="calendar"
              size={16}
              color="#3B82F6"
              className="mr-2"
            />
            <Text className="text-sm font-medium">{currentDate}</Text>
          </View>
        </View>

        {/* Gallery Controls */}
        {/* <View className="mb-4 flex-row items-center justify-between">
          <Text className="font-semibold text-gray-700">Community Proofs</Text>
          <View className="flex-row items-center">
            <TouchableOpacity className="mr-2 flex-row items-center">
              <Text className="mr-1 text-sm font-medium text-blue-500">
                Newest
              </Text>
              <FontAwesome name="sort-amount-desc" size={14} color="#3B82F6" />
            </TouchableOpacity>
            <TouchableOpacity>
              <FontAwesome name="ellipsis-v" size={14} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View> */}

        {/* Image Grid */}
        <FlatList
          data={todayProofs}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#3B82F6']}
              tintColor="#3B82F6"
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />

        {/* Refresh Button */}
        <TouchableOpacity
          className="mt-4 w-full rounded-lg bg-white py-3 shadow-sm"
          onPress={onRefresh}
        >
          <View className="flex-row items-center justify-center">
            {refreshing ? (
              <FontAwesome
                name="circle"
                size={16}
                color="#6B7280"
                className="mr-2 animate-spin"
              />
            ) : (
              <FontAwesome5
                name="sync-alt"
                size={16}
                color="#6B7280"
                className="mr-2"
              />
            )}
            <Text className="font-medium text-gray-700">
              {refreshing ? 'Loading...' : 'Refresh List'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default CommunityProofsScreen;
