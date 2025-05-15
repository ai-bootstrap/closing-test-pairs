// CheckScreen.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { showMessage } from 'react-native-flash-message';
import { z } from 'zod';

import { useSaveSubmissionForm } from '@/api/supabase/use-proof-submission';
import { FileUploader } from '@/components/file-uploader';
import {
  Button,
  ControlledInput,
  showErrorMessage,
  Text,
  View,
} from '@/components/ui';
import { SUPABASE_BUCKET_NAME } from '@/constants';
import useHandleDeepLink from '@/lib/hooks/use-handle-deep-link';
import { uploadFileToSupabaseByUri } from '@/services/supabase';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  appName: z.string().min(1, 'App name is required'),
  app_id: z.string().min(1, 'App ID is required'),
});

type FormData = z.infer<typeof formSchema>;

const CheckScreen = () => {
  useHandleDeepLink('/check');
  const { mutate: saveSubmission, isPending } = useSaveSubmissionForm();
  const [selectedFile, setSelectedFile] = useState<{
    uri: string;
    type: string;
    name: string;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { email, appname, app_id } = useLocalSearchParams<{
    email?: string;
    appname?: string;
    app_id: string;
  }>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: email || '',
      appName: appname || '',
      app_id: app_id || '',
    },
  });

  const handleFileSelected = (file: {
    uri: string;
    type: string;
    name: string;
  }) => {
    setSelectedFile(file);
  };

  const onSubmit = async (data: FormData) => {
    if (!selectedFile) {
      showErrorMessage('Please select an image to upload');
      return;
    }

    setIsUploading(true);
    try {
      // First upload the image
      const uploadResult = await uploadFileToSupabaseByUri(
        selectedFile.uri,
        SUPABASE_BUCKET_NAME, // Replace with your bucket name
        selectedFile.type,
        selectedFile.name
      );

      if (!uploadResult?.publicURL) {
        throw new Error('Image upload failed');
      }

      // Then submit the form with the image URL
      saveSubmission(
        {
          email: data.email,
          // app_name: data.appName,
          screen_shot: uploadResult.path,
          app_id: app_id,
        },
        {
          onSuccess: () => {
            showMessage({
              message: 'Submission saved successfully!',
              type: 'success',
            });
            setSelectedFile(null);
          },
          onError: (error) => {
            console.error('Error saving submission:', error);
            showErrorMessage('Error saving submission');
          },
        }
      );
    } catch (error) {
      console.error('Error uploading image:', error);
      showErrorMessage('Error uploading image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Submit Test Results' }} />
      <StatusBar translucent backgroundColor="transparent" />

      <View className="flex-1 p-4">
        <Text className="mb-6 text-xl font-bold">Test Submission Form</Text>

        <View className="space-y-4">
          <ControlledInput
            control={control}
            name="email"
            label="Tester Email"
            placeholder="your.email@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email?.message}
          />

          <ControlledInput
            control={control}
            name="appName"
            label="App Tested"
            placeholder="Name of the app you tested"
            error={errors.appName?.message}
          />
          <ControlledInput
            control={control}
            name="app_id"
            label="App Id"
            placeholder="Id of the app you tested"
            error={errors.app_id?.message}
          />

          <View>
            <Text className="mb-1 text-sm font-medium">Test Screenshot</Text>
            <FileUploader
              onFileSelected={handleFileSelected}
              subtitle="Upload a screenshot of your test results"
            />
          </View>

          <Button
            loading={isPending || isUploading}
            label={isUploading ? 'Uploading...' : 'Submit Test Results'}
            onPress={handleSubmit(onSubmit)}
            className="mt-6"
            disabled={!selectedFile}
          />
        </View>
      </View>
    </>
  );
};

export default CheckScreen;
