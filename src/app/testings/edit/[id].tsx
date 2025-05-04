import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import { Button, ControlledInput, showErrorMessage, Text, View } from '@/components/ui';
import { useUpdateAppForm } from '@/api/supabase/use-save-app-forms';
import { useUserInfo } from '@/store/user'; 
import { showMessage } from 'react-native-flash-message';
import { AppFormType, schema } from '@/types';
import { useNavigation } from "expo-router";
import { useCurrentEditingTesting } from '@/store/testings';



export default function EditAppScreen() {
  const navigation = useNavigation(); 
  const testingApp = useCurrentEditingTesting()
  console.log(testingApp?.id,'tapp id')

  const { handleSubmit,control } = useForm<AppFormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...testingApp,
    },
  }); 
  const { mutateAsync: updateAppForm, isPending,error} = useUpdateAppForm();   

  const updateApp: SubmitHandler<AppFormType> = async (formValue) => {
     
    try {
    const res = await updateAppForm({
      app_name: formValue.app_name,
      google_group_link: formValue.google_group_link,
      apk_link: formValue.apk_link,
      web_link: formValue.web_link,
      email: formValue.email,
      id: testingApp?.id,
    });
      if(res) {
        showMessage({
          message: 'App Info updated!',  
          type: 'success',
          onHide() {
            navigation.goBack(); // Navigate back to the previous screen after saving
          },
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while saving the app form.';
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
    <>
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
            Edit App {testingApp?.app_name}
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
          label="Update"
          loading={isPending}
          onPress={handleSubmit(updateApp)}
        /> 

<Button
          label="Update3"
          loading={isPending}
          onPress={()=>{ 
            console.log(error)
          }}
        /> 

        
      </View>
    </KeyboardAvoidingView>
    </>
  );
}