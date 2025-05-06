// components/CustomHeader.tsx
import { View, Text, Pressable, StatusBar } from 'react-native';
import { useRouter } from 'expo-router'; 
import { SafeAreaView } from '../ui';

export default function Header() {
  const router = useRouter();
  
  return (
    <SafeAreaView edges={['top']} className="bg-primary-900 rounded-b-3xl">
     <StatusBar translucent backgroundColor="#FF984C" />
    <View className="relative pb-8">
      {/* 波浪背景 */}
      <View className="absolute top-0 left-0 right-0 h-24 bg-primary-300 rounded-b-3xl" />
      
      {/* 内容区域 */}
      <View className="flex-row justify-between items-center pt-8 px-4">
        <Text className="text-2xl font-bold text-white">🎯 Closing Testing </Text>
        
        <View className="flex-row space-x-2">
          <Pressable 
            onPress={() => router.push('/testings/add')}
            className="px-4 py-2 bg-white/20 rounded-full"
          >
            <Text className="text-white font-medium">✨ Create</Text>
          </Pressable>
        </View>
      </View>
    </View>
     </SafeAreaView>
  );
}