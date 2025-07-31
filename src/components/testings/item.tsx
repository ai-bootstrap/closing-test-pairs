import { Feather } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { Linking } from 'react-native';

import { useAddToMyTestings } from '@/api/supabase/use-testings';
import { Button } from '@/components/ui';
import { useUserInfo } from '@/store/user';
import { type AppFormType } from '@/types';
import { getDaysDifference } from '@/utils';

type Props = AppFormType & {
  from?: 'all' | 'testings';
  handleEdit?: () => void;
};

export const TestingItem = ({
  id,
  app_name,
  apk_link,
  google_group_link,
  testing_users = [],
  creator,
  created_at,
  from = 'all',
  handleEdit,
}: Props) => {
  // Solid colors instead of gradients
  const headerColor = from === 'all' ? 'bg-green-300' : 'bg-amber-600';
  const userInfo = useUserInfo();
  const router = useRouter();

  const alreadyInTestingByMe =
    !!userInfo?.uid && testing_users.includes(userInfo?.uid);

  const { mutate: addToMyTestings, isPending: isAddingToMyTesting } =
    useAddToMyTestings();
  function handleAddToTesting() {
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
            if (!userInfo?.uid || !id) {
              console.log('userInfo.uid or item.id is missing');
              return;
            }
            addToMyTestings(
              {
                app_id: id,
                user_id: userInfo.uid, // Assuming you have the uid in the item object
              },
              {
                onSuccess: () => {
                  router.push(`/(app)/testings`); // Navigate to the testing screen with the item ID
                  console.log('App added to testing successfully!');
                },
                onError: (error) => {
                  console.error('Error adding app to testing:', error);
                },
              }
            );
          },
        },
      ],
      { cancelable: true }
    );
  }

  const testing_days = getDaysDifference(created_at);

  return (
    <View className="m-3 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-md shadow-neutral-300">
      {/* Header with solid color */}
      <View
        className={`${headerColor} flex-row items-center justify-between p-4`}
      >
        <Text className="text-xl font-bold text-white">
          {from === 'all' ? '🎨 ' : '🎮 '}
          {app_name}
        </Text>
        {from === 'testings' && creator === userInfo?.uid && (
          <Pressable
            onPress={handleEdit}
            className="rounded-full bg-white/20 p-1"
          >
            <AntDesign name="edit" size={20} color="white" />
          </Pressable>
        )}
      </View>

      {/* Content area */}
      <View className="p-4">
        {/* APK Link section */}
        <View className="mb-4">
          <Text className="mb-1 text-sm font-medium text-purple-600">
            📦 APK Link
          </Text>
          <View className="rounded-lg border border-purple-100 bg-purple-50 p-3">
            <Text className="text-purple-900" selectable>
              {apk_link}
            </Text>
          </View>
        </View>
        {/* <View className="mb-4">
          <Text className="text-sm font-medium text-purple-600 mb-1">creator</Text>
          <View className="p-3 bg-purple-50 rounded-lg border border-purple-100">
            <Text className="text-purple-900" selectable>{creator}</Text>
          </View>
        </View> */}

        {/* Group Link section */}
        {google_group_link && (
          <View className="mb-4">
            <Text className="mb-1 text-sm font-medium text-blue-600">
              👥 Google Group Link
            </Text>
            <View className="rounded-lg border border-blue-100 bg-blue-50 p-3">
              <Text className="text-blue-900" selectable>
                {google_group_link}
              </Text>
            </View>
          </View>
        )}

        {/* Testing info with icons */}
        <View className="mb-5 flex-row justify-between">
          <View className="flex-row items-center">
            <View className="mr-2 size-6 items-center justify-center rounded-full bg-blue-100">
              <Text className="text-blue-500">⏱️</Text>
            </View>
            <Text className="text-sm font-medium text-blue-500">
              Testing: <Text className="font-bold">{testing_days} days</Text>
            </Text>
          </View>

          <Link href={`/testings/detail/${id}`}>
            <View className="flex-row items-center">
              <View className="mr-2 size-6 items-center justify-center rounded-full bg-amber-100">
                <Text className="text-amber-500">👥</Text>
              </View>
              <Text className="text-sm font-medium text-amber-500">
                Testers:{' '}
                <Text className="font-bold">{testing_users.length}</Text>
              </Text>

              <Feather name="chevron-right" size={24} color="gray" />
            </View>
          </Link>
        </View>

        {/* Action buttons */}
        {from === 'all' ? (
          <Button
            loading={isAddingToMyTesting}
            onPress={handleAddToTesting}
            disabled={alreadyInTestingByMe}
            label={
              alreadyInTestingByMe ? 'Already in testing' : '🚀 Start Testing'
            }
            className="w-full items-center justify-center rounded-lg"
          />
        ) : (
          <View className="flex flex-row gap-2">
            <Pressable
              onPress={() => Linking.openURL(apk_link)}
              className="flex-1 items-center justify-center rounded-lg bg-blue-500 py-3 active:bg-blue-600"
            >
              <Text className="text-sm font-bold text-white">Open App</Text>
            </Pressable>
            {google_group_link && (
              <Pressable
                onPress={() => Linking.openURL(google_group_link)}
                className="flex-1 items-center justify-center rounded-lg border-2 border-blue-400 py-3 active:bg-blue-50"
              >
                <Text className="text-sm font-bold text-blue-500">
                  Join Group
                </Text>
              </Pressable>
            )}
          </View>
        )}
        <View className="flex flex-row gap-2">
          <Button
            onPress={() => {
              router.push(
                `/check?email=${userInfo?.email}&appname=${app_name}&app_id=${id}`
              );
            }}
            variant="outline"
            className="w-full"
            label="Mark tested"
          />
        </View>
      </View>
    </View>
  );
};
