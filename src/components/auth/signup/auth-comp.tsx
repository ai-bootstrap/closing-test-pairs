import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, Pressable, View } from 'react-native';
import * as z from 'zod';

import { RESET_PASSWORD_URL } from '@/api/client';
import Google from '@/components/auth/google';
import LinkWrapper from '@/components/ui/LinkWrapper';
import { hydrateAuth } from '@/lib';
import { supabase } from '@/services/supabase';

import {
  Button,
  Checkbox,
  ControlledInput,
  showErrorMessage,
  Text,
} from '../../ui';
import {
  checkTokenAndUpdateStore,
  useAppleSignIn,
  useGoogleSignIn,
} from './helpers';

export const AuthComp = () => {
  const [mode, setMode] = useState<'SignIn' | 'SignUp'>("SignIn")
  const { handleSubmit, control, getValues, setValue } = useForm<FormType>({
    resolver: zodResolver(schema),
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);

  const callAppleSignIn = useAppleSignIn();
  const callGoogleSignIn = useGoogleSignIn();

  hydrateAuth();

  const handleSignIn = async () => {
    handleSubmit(async (form) => {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (error) {
        showErrorMessage(error.message || 'Login failed');
      } else {
        checkTokenAndUpdateStore(data);
      }
      setLoading(false);
    })();
  };

  const handleResetPassword = async () => {
    const email = getValues('email');
    if (!email) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: RESET_PASSWORD_URL,
      });

      if (!error) {
        Alert.alert(
          'Check your email',
          'We sent you a link to reset your password'
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Unable to send reset email. Please try again later.'
      );
    }
  };

  async function checkAgreement() {
    return new Promise((resolve, reject) => {
      if (!agree) {
        Alert.alert(
          'Info',
          'You need to AGREE our Terms of Service and Privacy Policy',
          [
            {
              text: 'Disagree',
              onPress: () => {},
              style: 'cancel',
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

  async function onPressGoogle() {
    const agreed = await checkAgreement();
    if (agreed) callGoogleSignIn();
  }

  async function onPressApple() {
    const agreed = await checkAgreement();
    if (agreed) callAppleSignIn();
  }

  async function onPressEmail() {
    const agreed = await checkAgreement();
    if (agreed) router.push('/signup');
  }

  async function onPressMask() {
    router.push('/(app)');
  }

  async function handleSignUp(){
    Alert.alert("Please continue with Google", "this page is under building")
  }

  return (
    <View className="flex-1 justify-center bg-gray-50 p-6">
      {/* Header */}
      <View className="mb-8 items-center">
        <View className="mb-4 rounded-full bg-indigo-100 p-4">
          <MaterialIcons name="lock" size={32} color="#4f46e5" />
        </View>
        <Text className="mb-1 text-2xl font-bold text-gray-900">
          Welcome back
        </Text>
        <Text className="text-gray-500">
          Sign in to your account to continue
        </Text>
      </View>

      {/* Form */}
      <View className="rounded-xl bg-white p-6 shadow-sm">
        <View className="mb-4">
          <ControlledInput
            label="Email address"
            control={control}
            name="email"
            placeholder="your@email.com"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-indigo-500"
          />
        </View>

        <View className="mb-6">
          <View className="relative w-full">
            <ControlledInput
              label="Password"
              control={control}
              name="password"
              placeholder="••••••••"
              secureTextEntry={!showPassword}
              className="w-full items-center rounded-lg border border-gray-300 px-4 py-3 focus:border-indigo-500"
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              className="absolute bottom-5 right-2"
            >
              <MaterialIcons
                name={showPassword ? 'visibility' : 'visibility-off'}
                size={20}
                color="#6b7280"
              />
            </Pressable>

            <Pressable
              onPress={handleResetPassword}
              className="absolute right-2 top-1"
            >
              <Text className="text-sm font-medium text-indigo-600">
                Forgot password?
              </Text>
            </Pressable>
          </View>
        </View>

        <Button
          loading={loading}
          onPress={handleSignIn}
          className="w-full bg-indigo-600"
          label="Sign In"
        />

        {/* Divider */}
        <View className="my-6 flex-row items-center">
          <View className="h-px flex-1 bg-gray-300" />
          <Text className="mx-4 text-sm text-gray-500">OR Continue with</Text>
          <View className="h-px flex-1 bg-gray-300" />
        </View>

        {/* Social Login */}
        {/* Social Auth Section */}
        <View className="mt-1 space-y-4">
          {/* Social Buttons Grid */}
          <View className="flex-row justify-between space-x-3">
            {/* Google Button */}
            <Pressable
              onPress={onPressGoogle}
              className="h-14 flex-1 items-center justify-center rounded-xl border border-gray-200 bg-white active:bg-gray-50"
            >
              <View className="flex-row items-center">
                <FontAwesome name="google" size={20} color="#EA4335" />
                <Google />
                <Text className="ml-2 font-medium text-gray-700">Google</Text>
              </View>
            </Pressable>

            {/* Apple Button */}
            {/* <Pressable
              onPress={onPressApple}
              className="ml-4 h-14 flex-1 items-center justify-center rounded-xl bg-black active:bg-gray-800"
            >
              <View className="flex-row items-center">
                <FontAwesome name="apple" size={20} color="white" />
                <Text className="ml-2 font-medium text-white">Apple</Text>
              </View>
            </Pressable> */}
          </View>

          {/* Guest Access Section - Non-button version */}
          <View className="items-center pt-6">
            <Pressable onPress={onPressMask} className="flex-row items-center">
              <Ionicons name="sparkles" size={16} color="#7C3AED" />
              <Text className="ml-2 font-medium text-indigo-600 underline decoration-indigo-300">
                Continue as Guest
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Agreement Checkbox */}
        <View className="mt-6 flex flex-row">
          <Checkbox
            accessibilityLabel="agreement"
            checked={agree}
            onChange={() => setAgree(!agree)}
          />
          <Text className="ml-2 mt-1 p-1 text-sm">
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

        {/* Sign up link */}
        <View className="mt-4 flex-row justify-center">
          <Text className="text-sm text-gray-500">Don't have an account? </Text>
          <Pressable onPress={handleSignUp}>
            <Text className="text-sm font-medium text-indigo-600">Sign up</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const schema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email format'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters'),
});

export type FormType = z.infer<typeof schema>;
