/* eslint-disable react/no-unstable-nested-components */
import { Link, Redirect, SplashScreen, Tabs } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, Text } from '@/components/ui';
import {
  Feed as FeedIcon,
  Settings as SettingsIcon,
  Style as StyleIcon,
} from '@/components/ui/icons';
import { useAuth, useIsFirstTime } from '@/lib';
import { Linking } from 'react-native';

export default function TabLayout() {
  const status = useAuth.use.status();
  const [isFirstTime] = useIsFirstTime();
  const hideSplash = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);
  useEffect(() => {
    if (status !== 'idle') {
      setTimeout(() => {
        hideSplash();
      }, 1000);
    }
  }, [hideSplash, status]);

  if (isFirstTime) {
    return <Redirect href="/onboarding" />;
  }
  // TODO: release these block before production
  if (status === 'signOut') {
    return <Redirect href="/user/login" />;
  }
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color }) => <FeedIcon color={color} />,
          headerRight: () => <CreateNewPostLink />,
          tabBarButtonTestID: 'feed-tab',
        }}
      />

      <Tabs.Screen
        name="style"
        options={{
          title: 'Style',
          headerShown: false,
          tabBarIcon: ({ color }) => <StyleIcon color={color} />,
          tabBarButtonTestID: 'style-tab',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerShown: false,
          tabBarIcon: ({ color }) => <MaterialIcons name="settings" size={24} color="black" />,
          tabBarButtonTestID: 'settings-tab',
        }}
      />
      <Tabs.Screen
        name="testings"
        options={{
          title: 'Testings',
          // headerShown: false,
          tabBarIcon: ({ color }) => <AntDesign name='android' size={20} color={color} />,
        }}
      />
    </Tabs>
  );
}

const CreateNewPostLink = () => {
  return (
    // <Link href="/feed/add-post" asChild>
      <Pressable onPress={()=>{
        Linking.openURL('ClosingTestPairs://check')
      }}>
        <Text className="px-3 text-primary-300">Create</Text>
      </Pressable>
    // </Link>
  );
};
