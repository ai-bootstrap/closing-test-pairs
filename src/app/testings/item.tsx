import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Linking } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

type Props = {
  app_name: string;
  apk_link: string;
  google_group_link: string;
  testing_days?: number;
  testing_users?: number;
  from?: 'all' | 'testings';
  handleEdit?: () => void;
  addToTesting?: () => void;
};

export const TestingItem = ({
  app_name,
  apk_link,
  google_group_link,
  testing_days = 0,
  testing_users = 0,
  from = "all",
  handleEdit,
  addToTesting
}: Props) => { 
  // Solid colors instead of gradients
  const headerColor = from === 'all' ? 'bg-green-300' : 'bg-amber-600';
  
  return (
    <View className="m-3 overflow-hidden rounded-2xl bg-white shadow-md shadow-neutral-300 border border-neutral-200">
      {/* Header with solid color */}
      <View className={`${headerColor} p-4 flex-row justify-between items-center`}>
        <Text className="text-xl font-bold text-white">
          {from === 'all' ? '🎨 ' : '🎮 '}{app_name}
        </Text>
        {from === 'testings' && (
          <Pressable 
            onPress={handleEdit} 
            className="p-1 bg-white/20 rounded-full"
          >
            <AntDesign name="edit" size={20} color="white" />      
          </Pressable>
        )}
      </View>
      
      {/* Content area */}
      <View className="p-4">
        {/* APK Link section */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-purple-600 mb-1">📦 APK Link</Text>
          <View className="p-3 bg-purple-50 rounded-lg border border-purple-100">
            <Text className="text-purple-900" selectable>{apk_link}</Text>
          </View>
        </View>
        
        {/* Group Link section */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-blue-600 mb-1">👥 Google Group Link</Text>
          <View className="p-3 bg-blue-50 rounded-lg border border-blue-100">
            <Text className="text-blue-900" selectable>{google_group_link}</Text>
          </View>
        </View>
        
        {/* Testing info with icons */}
        <View className="mb-5 flex-row justify-between">
          <View className="flex-row items-center">
            <View className="w-6 h-6 bg-blue-100 rounded-full items-center justify-center mr-2">
              <Text className="text-blue-500">⏱️</Text>
            </View>
            <Text className="text-sm font-medium text-blue-500">
              Testing: <Text className="font-bold">{testing_days} days</Text>
            </Text>
          </View>
          
          <View className="flex-row items-center">
            <View className="w-6 h-6 bg-amber-100 rounded-full items-center justify-center mr-2">
              <Text className="text-amber-500">👥</Text>
            </View>
            <Text className="text-sm font-medium text-amber-500">
              Testers: <Text className="font-bold">{testing_users}</Text>
            </Text>
          </View>
        </View>
        
        {/* Action buttons */}
        {from === 'all' ? (
          <Pressable
            onPress={addToTesting}
            className="w-full bg-amber-500 py-3 rounded-lg items-center justify-center active:bg-amber-600"
          >
            <Text className="text-white font-bold text-sm">🚀 Start Testing</Text>
          </Pressable>
        ) : (
          <View className="flex flex-row gap-2">
            <Pressable 
              onPress={() => Linking.openURL(apk_link)}
              className="flex-1 bg-blue-500 py-3 rounded-lg items-center justify-center active:bg-blue-600"
            >
              <Text className="text-white font-bold text-sm">Open App</Text>
            </Pressable>
            <Pressable 
              onPress={() => Linking.openURL(google_group_link)}
              className="flex-1 border-2 border-blue-400 py-3 rounded-lg items-center justify-center active:bg-blue-50"
            >
              <Text className="text-blue-500 font-bold text-sm">Join Group</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
};
