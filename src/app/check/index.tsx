import React from 'react';
import { Button, showErrorMessage, Text, View } from '@/components/ui';
import useHandleDeepLink from '@/lib/hooks/use-handle-deep-link';
import { useLocalSearchParams ,Stack} from 'expo-router';
import { useSaveSubmissionForm } from '@/api/supabase/use-submission';
import { showMessage } from 'react-native-flash-message';

 const CheckScreen = () => {
  useHandleDeepLink('/check');
  const {mutate: saveSubmission, isPending} = useSaveSubmissionForm()
  // Get parameters from the deep link
  const { email, appname } = useLocalSearchParams<{
    email?: string;
    appname?: string;
  }>();

  function submitMyTest() {
    if(!email || !appname) {
      console.log('Email or appname is missing')  
      return;
    }
    saveSubmission(
      {
        email,
        app_name: appname
      },
      {
        onSuccess: () => {
          showMessage({
            message: 'Submission saved successfully!',
            type: 'success',})
        },
        onError: (error) => {
          console.error('Error saving submission:', error)
          showErrorMessage('Error saving submission:')
        },
      }
    )
  }

  return (
    <>
    <Stack.Screen options={{ title: 'Check Screen' }} />
    <View className='flex-1 justify-center items-center'>

    
    <View style={{ padding: 20 }}>
      <Text>Tester: {email || 'Not provided'}</Text>
      <Text>App Tested: {appname || 'Not provided'}</Text>
    </View>

    <Button loading={isPending} label='I have tested your app' onPress={submitMyTest}/> 
    </View>
  </>
  )
}

export default CheckScreen;