/* eslint-disable react/no-unstable-nested-components */
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Redirect, SplashScreen, Tabs } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import { Linking } from 'react-native';

import Header from '@/components/Header';
import { Pressable, Text } from '@/components/ui';
import { Feed as FeedIcon } from '@/components/ui/icons';
import { useAuth, useIsFirstTime } from '@/lib';

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

  // if (isFirstTime) {
  //   return <Redirect href="/onboarding" />;
  // }
  // TODO: release these block before production
  if (status === 'signOut') {
    return <Redirect href="/user/login" />;
  }
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          header: () => <Header />,
          headerTransparent: true,
          title: 'All',
          tabBarIcon: ({ color }) => <FeedIcon color={color} />,
          // tabBarButtonTestID: 'feed-tab',
        }}
      />

      <Tabs.Screen
        name="testings"
        options={{
          title: 'Testings',
          // headerShown: false,
          tabBarIcon: ({ color }) => (
            <AntDesign name="android" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="settings" size={24} color="black" />
          ),
          tabBarButtonTestID: 'settings-tab',
        }}
      />
    </Tabs>
  );
}

const CreateNewPostLink = () => {
  return (
    // <Link href="/feed/add-post" asChild>
    <Pressable
      onPress={() => {
        Linking.openURL('ClosingTestPairs://check');
      }}
    >
      <Text className="px-3 text-primary-300">Create</Text>
    </Pressable>
    // </Link>
  );
};
