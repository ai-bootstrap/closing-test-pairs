// components/CustomHeader.tsx
import { useRouter } from 'expo-router';
import { Pressable, StatusBar, Text, View } from 'react-native';

import { SafeAreaView } from '../ui';

export default function Header() {
  const router = useRouter();

  return (
    <SafeAreaView edges={['top']} className="rounded-b-3xl bg-primary-900">
      <StatusBar translucent backgroundColor="#FF984C" />
      <View className="relative pb-8">
        {/* 波浪背景 */}
        <View className="absolute inset-x-0 top-0 h-24 rounded-b-3xl bg-primary-300" />

        {/* 内容区域 */}
        <View className="flex-row items-center justify-between px-4 pt-8">
          <Text className="text-2xl font-bold text-white">
            🎯 Closing Testing{' '}
          </Text>

          <View className="flex-row space-x-2">
            <Pressable
              onPress={() => router.push('/testings/add')}
              className="rounded-full bg-white/20 px-4 py-2"
            >
              <Text className="font-medium text-white">✨ Create</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
