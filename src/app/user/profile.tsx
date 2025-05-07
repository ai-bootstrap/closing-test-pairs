import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from '@/components/ui'; 
 import { useUserInfo } from '@/store/user';

const UserProfilePage = () => {
  const userInfo = useUserInfo();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 py-8">
        <Text className="text-3xl font-bold text-gray-900 mb-6">User Profile</Text>
        {userInfo ? (
          <View className="bg-gray-100 rounded-xl p-6 shadow-md">
            <Text className="text-lg font-semibold text-gray-800 mb-2">
              Name: <Text className="font-normal text-gray-700">{userInfo.display_name || '--'}</Text>
            </Text>
            <Text className="text-lg font-semibold text-gray-800">
              Email: <Text className="font-normal text-gray-700">{userInfo.email}</Text>
            </Text>
          </View>
        ) : (
          <View className="items-center justify-center mt-10">
            <Text className="text-base text-gray-500">Loading user information...</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}