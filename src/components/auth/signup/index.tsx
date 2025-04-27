import Entypo from '@expo/vector-icons/Entypo';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert } from 'react-native';

import Google from '@/components/auth/google';
import { Checkbox, Pressable, Text, View } from '@/components/ui';

import { useAppleSignIn, useGoogleSignIn } from './helpers';
import LinkWrapper from '@/components/ui/LinkWrapper';

export const SignUpSelectors = () => {
  const [agree, setAgree] = useState(false);
  const callAppleSignIn = useAppleSignIn();
  const callGoogleSignIn = useGoogleSignIn();

  async function onPressEmail() {
    await checkAgreement();
    router.push('/user/login_email');
  }

  async function checkAgreement() {
    return new Promise((resolve, reject) => {
      if (!agree) {
        Alert.alert(
          'Info',
          'You need to AGREE our Terms of Service and Privacy Policy',
          [
            {
              text: 'Disagree',
              onPress: () => {
                // router.back();
              },
              style: 'cancel', // Marks this button as a cancel action
            },
            {
              text: 'Agree',
              onPress: async () => {
                setAgree(true);
                resolve(true);
              },
            },
          ],
          { cancelable: true }
        );
      } else {
        resolve(true);
      }
    });
  }
  async function onPressApple() {
    await checkAgreement();
    if (!agree) return;
    callAppleSignIn();
  }
  async function onPressGoogle() {
    await checkAgreement();
    if (!agree) return;
    callGoogleSignIn();
  }

  async function onPressMask(){
    router.push('/(app)');
  }
  return (
    <View className="my-6 flex w-4/5 flex-col justify-center align-middle">

      <Pressable
        onPress={onPressGoogle}
      >
        <View className="my-4 flex flex-row justify-center rounded rounded-s bg-black align-middle">
          <View className="flex w-full flex-row items-center">
            <Google />
            <Text className=" ml-5 text-center text-lg font-bold text-charcoal-50">
              Continue with Google
            </Text>
          </View>
        </View>
      </Pressable>

      <Pressable
        onPress={onPressEmail}
        // pointerEvents={isPressable ? 'auto' : 'none'}
      >
        <View className="flex flex-row justify-center rounded rounded-s bg-black align-middle">
          <View className="flex w-full flex-row items-center">
            <View className="m-1 flex h-[44] w-12 flex-row items-center justify-center rounded rounded-s bg-white">
              <Entypo name="email" size={24} color="orange" />
            </View>
            <Text className=" ml-5 rounded-s text-center text-lg font-bold text-charcoal-50">
              Continue with Email
            </Text>
          </View>
        </View>
      </Pressable>

      <Pressable
        onPress={onPressMask}
        className='mt-4'
      >
        <View className="flex flex-row justify-center rounded rounded-s bg-black align-middle">
          <View className="flex w-full flex-row items-center  ">
            <View className="m-1 flex h-[44] w-12 flex-row items-center justify-center rounded rounded-s bg-white">
              <Entypo name="mask" size={24} color="orange" />
            </View>
            <Text className=" ml-5 text-center text-lg font-bold text-charcoal-50">
              Just take a look
            </Text>
          </View>
        </View>
      </Pressable>

      <View className="flex flex-row">
        <Checkbox
          accessibilityLabel="agreement"
          checked={agree}
          onChange={() => {
            setAgree(!agree);
          }}
        />
        <Text className="ml-2 mt-6 p-1">
          By logging in or creating an account, you agree to our
          <LinkWrapper src="https://kacoka.co/terms-of-service">
            {' '}
            Terms of Service
          </LinkWrapper>
          {''} and {''}
          <LinkWrapper src="https://kacoka.co/privacy-policy">
            Privacy Policy
          </LinkWrapper>
        </Text>
      </View>
    </View>
  );
};
