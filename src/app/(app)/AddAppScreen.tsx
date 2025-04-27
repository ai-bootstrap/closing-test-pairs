import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import * as z from 'zod';

import { Button, ControlledInput, showErrorMessage, Text, View } from '@/components/ui';
import { useSaveAppForm } from '@/api/supabase/use-save-app-forms';
import { useUserInfo } from '@/store/user'; 
import { showMessage } from 'react-native-flash-message';

const schema = z.object({
  app_name: z.string().min(1, 'App Name is required'),
  google_group_link: z.string().min(1, 'Google Group Link is required'),
  apk_link: z.string().min(1, 'Google Group Link is required'),
  web_link: z.string().min(1, 'Google Group Link is required'),
  email: z.string().optional(),
});

export type AppFormType = z.infer<typeof schema>;

export default function AddAppScreen() {
  const userInfo = useUserInfo()
  const { handleSubmit, control } = useForm<AppFormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      google_group_link: '',
      apk_link: '',
      web_link: '',
      email: userInfo?.email || '',
    },
  }); 
  const { mutateAsync: saveAppForm, isPending } = useSaveAppForm();   

  const saveApp: SubmitHandler<AppFormType> = async (formValue) => {
    console.log('formValue', formValue);
    try {
      const res = await saveAppForm(formValue);
      if(res) {
        showMessage({
          message: 'App Info saved successfully!',  
          type: 'success',
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while saving the app form.';
      showErrorMessage(errorMessage);
      return;
    }
  };

  return (
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
          placeholder="required"
        />

        <ControlledInput
          testID="apkLink"
          control={control}
          name="apk_link"
          label="APK Link"
          placeholder="required"
        />

        <ControlledInput
          testID="webLink"
          control={control}
          name="web_link"
          label="Web Link"
          placeholder="Required"
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
  );
}