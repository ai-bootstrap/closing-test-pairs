import React from 'react';

import { Image, Pressable, Text, View } from '@/components/ui';
import { Linking } from 'react-native';
import { AppFormType } from '@/types';

type Props = AppFormType;

const images = [
  'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1515386474292-47555758ef2e?auto=format&fit=crop&w=800&q=80',
  'https://plus.unsplash.com/premium_photo-1666815503002-5f07a44ac8fb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=800&q=80',
];

export const Card = ({ apk_link,google_group_link, }: Props) => {
  return (
      <Pressable>
        <View className="m-2 overflow-hidden rounded-xl  border border-neutral-300 bg-white  dark:bg-neutral-900">
          <Image
            className="h-56 w-full overflow-hidden rounded-t-xl"
            contentFit="cover"
            source={{
              uri: images[Math.floor(Math.random() * images.length)],
            }}
          />

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
