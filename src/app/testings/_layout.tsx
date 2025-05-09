import { SafeAreaView,Text } from "@/components/ui"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"

const TestingPageLayout = ({ children }: { children: React.ReactNode })=>{
  return (
    <SafeAreaView edges={['top']} className="flex-1">
      <StatusBar translucent/>
      <Stack screenOptions={{
        headerShown: false
      }}/>
    </SafeAreaView>
  )
}

export default TestingPageLayout