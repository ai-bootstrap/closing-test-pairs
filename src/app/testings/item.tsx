import React from 'react';
import { Button, colors, Image, Input, Pressable, Text, View } from '@/components/ui';
import { Linking } from 'react-native';
import { AppFormType } from '@/types';

type Props = AppFormType & {
  testing_days?: number;
  testing_users?: number;
  app_icon?: string; // URL or local image reference
  from? : 'all' | 'testings'; // Specify the source of the component
};

export const TestingItem = ({
  app_name,
  apk_link,
  google_group_link,
  testing_days,
  testing_users,
  app_icon,
  from = "all" // 如果是 all 頁面，display specific color
}: Props) => {
  const headerColor = from === 'all' ? colors.primary[900] : colors.primary[500];
  return (
    <View className="m-2 overflow-hidden rounded-xl  border border-neutral-300 bg-white  dark:bg-neutral-900">
      {/* App Header */}
      <View className="bg-success-500 p-4" style={{backgroundColor: headerColor}}>
        <Text className="text-xl font-semibold text-white">{app_name}</Text>
      </View>
      
      {/* App Content */}
      <View className="p-4">
        {/* APK Link Section */}
        <View className="mb-4"> 
          <Input label="APK Link" value={apk_link} disabled/>
        </View>
        
        {/* Group Link Section */}
        <View className="mb-4">
          <Input label="Google Group Link" value={google_group_link} disabled/>
        </View>
        
        {/* Testing Info */}
        <View className="mb-4 flex-row justify-between">
          <Text className="text-sm text-cyan-400">Testing: {testing_days} days</Text>
          <Text className="text-sm text-amber-500">Testers: {testing_users}</Text>
        </View>
        
        {/* Action Buttons */}
        <View className="flex-row space-x-3">
          <Button
            label='Download APK'
            onPress={() => Linking.openURL(apk_link)} 
            variant='secondary'
            className='flex-1 mr-2'
            backgroundColor={headerColor}
          > 
          </Button>
          <Button
            onPress={() => Linking.openURL(google_group_link)}
            label='Join Group'
            variant='outline'
            className='flex-1'
          > 
          </Button>
        </View>
      </View>
    </View>
  );
};