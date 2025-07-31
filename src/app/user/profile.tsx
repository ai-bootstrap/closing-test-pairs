import React from 'react';
import { Text, View } from 'react-native';

import { SafeAreaView } from '@/components/ui';
import { useUserInfo } from '@/store/user';

const UserProfilePage = () => {
  const userInfo = useUserInfo();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 py-8">
        <Text className="mb-6 text-3xl font-bold text-gray-900">
          User Profile
        </Text>
        {userInfo ? (
          <View className="rounded-xl bg-gray-100 p-6 shadow-md">
            <Text className="mb-2 text-lg font-semibold text-gray-800">
              Name:{' '}
              <Text className="font-normal text-gray-700">
                {userInfo.display_name || '--'}
              </Text>
            </Text>
            <Text className="text-lg font-semibold text-gray-800">
              Email:{' '}
              <Text className="font-normal text-gray-700">
                {userInfo.email}
              </Text>
            </Text>
            <Text className="mt-4 text-lg font-semibold text-gray-800">
              UID:{' '}
              <Text className="font-normal text-gray-700">
                {userInfo.uid || '--'}
              </Text>
            </Text>
          </View>
        ) : (
          <View className="mt-10 items-center justify-center">
            <Text className="text-base text-gray-500">
              Loading user information...
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default UserProfilePage;
