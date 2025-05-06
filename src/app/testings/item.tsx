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
  const headerColor = from === 'all' ? 'bg-amber-800' : 'bg-amber-600';
  
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
          <View className="flex-row space-x-3">
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

// List container component
export const TestingList = () => {
  return (
    <View className="flex-1 bg-gray-50 p-2">
      {/* Top filter and create button */}
      <View className="flex-row justify-between items-center mb-4 px-2">
        <View className="flex-row bg-white rounded-full p-1 shadow-sm border border-neutral-200">
          <Pressable className="px-4 py-2 bg-amber-800 rounded-full">
            <Text className="text-white font-medium">All</Text>
          </Pressable>
          <Pressable className="px-4 py-2">
            <Text className="text-gray-600">Active</Text>
          </Pressable>
          <Pressable className="px-4 py-2">
            <Text className="text-gray-600">Completed</Text>
          </Pressable>
        </View>
        
        <Pressable className="px-4 py-2 bg-amber-500 rounded-full shadow-sm active:bg-amber-600">
          <Text className="text-white font-medium">✨ Create</Text>
        </Pressable>
      </View>
      
      {/* Testing items list */}
      <TestingItem
        app_name="but_how_are_you"
        apk_link="222"
        google_group_link="4422"
        testing_days={5}
        testing_users={12}
        from="all"
        addToTesting={() => console.log('Start testing')}
      />
      
      <TestingItem
        app_name="ertrewre99999"
        apk_link="wr3wr"
        google_group_link="wer3rw3"
        testing_days={3}
        testing_users={8}
        from="all"
        addToTesting={() => console.log('Start testing')}
      />
    </View>
  );
};