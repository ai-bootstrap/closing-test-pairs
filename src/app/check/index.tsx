import { Stack, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { showMessage } from 'react-native-flash-message';

import { useSaveSubmissionForm } from '@/api/supabase/use-tester-submission';
import { Button, showErrorMessage, Text, View } from '@/components/ui';
import useHandleDeepLink from '@/lib/hooks/use-handle-deep-link';

const CheckScreen = () => {
  useHandleDeepLink('/check');
  const { mutate: saveSubmission, isPending } = useSaveSubmissionForm();
  // Get parameters from the deep link
  const { email, appname } = useLocalSearchParams<{
    email?: string;
    appname?: string;
  }>();

  function submitMyTest() {
    if (!email || !appname) {
      console.log('Email or appname is missing');
      return;
    }
    saveSubmission(
      {
        email,
        app_name: appname,
      },
      {
        onSuccess: () => {
          showMessage({
            message: 'Submission saved successfully!',
            type: 'success',
          });
        },
        onError: (error) => {
          console.error('Error saving submission:', error);
          showErrorMessage('Error saving submission:');
        },
      }
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Check Screen' }} />
      <StatusBar translucent backgroundColor="transparent" />

      <View className="flex-1 items-center justify-center">
        <View style={{ padding: 20 }}>
          <Text>Tester: {email || 'Not provided'}</Text>
          <Text>App Tested: {appname || 'Not provided'}</Text>
        </View>

        <Button
          loading={isPending}
          label="I have tested your app"
          onPress={submitMyTest}
        />
      </View>
    </>
  );
};

export default CheckScreen;
