import React from 'react';

import { Image, Pressable, Text, View } from '@/components/ui';
import { Linking } from 'react-native';
import { AppFormType } from '@/types';

type Props = AppFormType;

 
export const TestingItem = ({ apk_link,google_group_link, }: Props) => {
  return (
      <Pressable>
        <View className="m-2 overflow-hidden rounded-xl  border border-neutral-300 bg-white  dark:bg-neutral-900">

          <View className="p-2">
            <Text className="py-3 text-2xl ">Google Group</Text>
            <Text numberOfLines={3} className="leading-snug text-gray-600" onPress={() => {Linking.openURL(google_group_link)}}>
              {google_group_link}
            </Text>
          </View>
          <View className="p-2">
            <Text className="py-3 text-2xl ">Closing Test APK</Text>
            <Text numberOfLines={3} className="leading-snug text-gray-600" onPress={() => {Linking.openURL(apk_link)}}>
              {apk_link}
            </Text>
          </View>
        </View>
      </Pressable>
  );
};
