import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from 'expo-router';
import React, { useEffect } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { showMessage } from 'react-native-flash-message';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import { useCreateTestingApp } from '@/api/supabase/use-app-forms';
import {
  Button,
  ControlledInput,
  showErrorMessage,
  Text,
  View,
} from '@/components/ui';
import { useAuth } from '@/lib';
import { useUserInfo } from '@/store/user';
import { type AppFormType, schema } from '@/types';

export default function AddAppScreen() {
  const userInfo = useUserInfo();
  const auth = useAuth();
  const navigation = useNavigation();
  const { handleSubmit, control } = useForm<AppFormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      google_group_link: '',
      apk_link: '',
      web_link: '',
      email: userInfo?.email || '',
    },
  });
  const { mutateAsync: saveAppForm, isPending } = useCreateTestingApp();

  const saveApp: SubmitHandler<AppFormType> = async (formValue) => {
    console.log('formValue', formValue);
    try {
      const res = await saveAppForm({
        ...formValue,
        creator: userInfo!.uid,
      });
      if (res) {
        showMessage({
          message: 'App Info saved successfully!',
          type: 'success',
          onHide() {
            navigation.goBack(); // Navigate back to the previous screen after saving
          },
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred while saving the app form.';
      showErrorMessage(errorMessage);
      return;
    }
  };

  useEffect(() => {
    // Set the header title when the component mounts
    navigation.setOptions({
      title: '',
    });
  }, [navigation]);

  return (
    <View className="h-full flex-1">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={10}
      >
        <View className="flex-1 justify-center p-4">
          <View className="items-center justify-center">
            <Text
              testID="form-title"
              className="pb-6 text-center text-4xl font-bold"
            >
              Add My App
            </Text>

            <Text className="mb-6 max-w-xs text-center text-gray-500">
              Please fill in the details below to add a new app.
            </Text>
          </View>

          <ControlledInput
            testID="appName"
            control={control}
            name="app_name"
            label="App Name"
            placeholder="required"
          />

          <ControlledInput
            testID="googleGroupLink"
            control={control}
            name="google_group_link"
            label="Google Group Link"
            placeholder="Optional"
          />

          <ControlledInput
            testID="apkLink"
            control={control}
            name="apk_link"
            label="APK Link"
            placeholder="required"
          />

          <ControlledInput
            control={control}
            name="web_link"
            label="Web Link"
            placeholder="Optional"
          />
          <ControlledInput
            testID="email"
            control={control}
            name="email"
            label="Developer Email"
            placeholder="Optional"
          />

          <Button
            testID="saveAppButton"
            label="Save App"
            loading={isPending}
            onPress={handleSubmit(saveApp)}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
