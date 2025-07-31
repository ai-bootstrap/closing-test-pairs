import MaterialIcons from '@expo/vector-icons/MaterialIcons'; // 添加 MaterialIcons 导入
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { Alert, Pressable } from 'react-native';
import * as z from 'zod';

import { RESET_PASSWORD_URL } from '@/api/client';
import { createUserProfileIsNotExist } from '@/api/supabase/user/profile';
import Apple from '@/components/auth/apple';
import Google from '@/components/auth/google';
import { hydrateAuth } from '@/lib';
import { getItem } from '@/lib/storage';
// import { createUserProfileIsNotExist } from '@/services/profile-services';
import { supabase } from '@/services/supabase';

import {
  checkTokenAndUpdateStore,
  useAppleSignIn,
  useGoogleSignIn,
} from './auth/signup/helpers';
import { Button, ControlledInput, showErrorMessage, Text, View } from './ui';

const schema = z.object({
  name: z.string().optional(),
  verifyCode: z.string().optional(),
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email format'),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(6, 'Password must be at least 6 characters'),
});

export type FormType = z.infer<typeof schema>;

export type LoginFormProps = {
  onSubmit?: SubmitHandler<FormType>;
};

// eslint-disable-next-line max-lines-per-function
export const LoginForm = ({}: LoginFormProps) => {
  const { handleSubmit, control, getValues, setValue } = useForm<FormType>({
    resolver: zodResolver(schema),
  });
  const [showPassword, setShowPassword] = useState(false); // 添加状态以控制密码可见性

  const [formType, setFormType] = useState('signUp'); // signUp
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const isLoginPage = formType === 'login';
  const btnLabel = isLoginPage ? 'Sign In' : 'Sign Up';
  const callAppleSignIn = useAppleSignIn();
  const callGoogleSignIn = useGoogleSignIn();

  const tip = isLoginPage
    ? `Don't have account? SignUp`
    : `Have account? Login`;

  function handleToggleFormType() {
    setFormType(formType === 'login' ? 'signUp' : 'login');
  }
  hydrateAuth();

  async function onPressGoogle() {
    callGoogleSignIn();
  }

  async function onPressApple() {
    callAppleSignIn();
  }

  async function handleVerifyCode(form: any) {
    if (!form.verifyCode) {
      Alert.alert('Please input Verify Code');
      return;
    }
    const { data, error } = await supabase.auth.verifyOtp({
      email: form.email,
      token: form.verifyCode,
      type: 'signup',
    });
    console.log({ data });

    if (error) {
      Alert.alert('验证码验证失败', error.message);
    } else {
      hydrateAuth();
      Alert.alert('验证成功', '您的账户已验证');
    }
  }

  async function handleSignUpWithEmail() {
    if (isLoginPage) {
      handleSubmit(async (form) => {
        setLoading(true);
        const _body = {
          email: form.email,
          password: form.password,
        };
        const { data, error } = await supabase.auth.signInWithPassword(_body);
        if (error) {
          showErrorMessage(error.message || 'Login failed');
        } else {
          checkTokenAndUpdateStore(data);
        }
        setLoading(false);
      })();
    } else {
      handleSubmit(async (form) => {
        if (codeSent) {
          handleVerifyCode(form);
          return;
        }
        setLoading(true);
        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
        });
        if (error) {
          Alert.alert('Failed', error.message);
        } else {
          if (data.user?.email) {
            const name = data.user?.email.split('@')[0];
            createUserProfileIsNotExist({
              email: data.user?.email,
              display_name: name,
              uid: data.user.id,
            });
          }
          Alert.alert(
            'Success',
            'Please check your email for Confirmation Code'
          );
          setCodeSent(true);
        }
        setLoading(false);
      })();
    }
  }

  async function handleResetPasswordWithRandomPassword() {
    const _email = getValues('email');
    if (!_email) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(
        getValues('email'),
        {
          redirectTo: RESET_PASSWORD_URL, // 这里是点击邮件后重定向到的页面
        }
      );

      console.log({ data, error });

      if (!error) {
        Alert.alert('Info', 'Please check your email to reset password');
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Unable to open the email app. please send email to service@kacoka.co using the email you registered'
      );
    }
  }

  useEffect(() => {
    const loadCredentials = async () => {
      const savedEmailAndPassword: any = await getItem('user_email_password');
      console.log({ savedEmailAndPassword });
      if (savedEmailAndPassword.email) {
        setValue('email', savedEmailAndPassword.email); // 设置电子邮件
      }
      if (savedEmailAndPassword.password) {
        setValue('password', savedEmailAndPassword.password); // 设置密码
      }
    };
    loadCredentials();
  }, [setValue]);

  // useEffect(() => {
  //   supabase.auth.getSession().then(({ data: { session } }) => {
  //     console.log(session, 1);
  //   });

  //   supabase.auth.onAuthStateChange((_event, session) => {
  //     console.log(session, 2);
  //   });
  // }, []);
  return (
    <View className="flex-1 justify-center p-4 dark:bg-neutral-800">
      <Text
        testID="form-title"
        className="pb-6 text-center text-2xl dark:text-neutral-200"
      >
        {btnLabel}
      </Text>

      {!isLoginPage ? (
        <ControlledInput
          testID="name"
          control={control}
          name="name"
          label="Name"
        />
      ) : (
        <></>
      )}

      <ControlledInput
        testID="email-input"
        control={control}
        name="email"
        label="Email"
        style={{ borderRadius: 6 }}
      />
      <View className="flex w-full flex-row justify-end">
        <View className="flex-1">
          <ControlledInput
            testID="password-input"
            control={control}
            name="password"
            label="Password"
            placeholder="******"
            secureTextEntry={!showPassword}
            style={{ borderRadius: 6 }}
          />
        </View>
        <Pressable
          className="flex-0 bg-color-red flex justify-end pb-4 pl-3"
          onPress={() => setShowPassword(!showPassword)}
        >
          <MaterialIcons
            name={showPassword ? 'visibility' : 'visibility-off'} // 切换眼睛图标
            size={24}
            color="black" // 根据需要设置颜色
          />
        </Pressable>
      </View>

      {codeSent ? (
        <View className="flex w-full flex-row items-baseline justify-start">
          <View className="flex-1">
            <ControlledInput
              control={control}
              name="verifyCode"
              label="Verify Code (6 digits)"
              secureTextEntry={true}
              style={{ borderRadius: 6 }}
            />
          </View>

          <Button label="Resend" className="flex-1" />
        </View>
      ) : (
        <></>
      )}
      <Button
        loading={loading}
        className="mt-6 h-14"
        label={codeSent ? 'Confirm Sign Up' : btnLabel}
        onPress={handleSignUpWithEmail}
      />
      {isLoginPage ? (
        <View className="my-6 flex w-full flex-row justify-center align-middle">
          <View className="mr-4 flex justify-center align-middle">
            <Pressable onPress={onPressGoogle}>
              <Google />
            </Pressable>
          </View>
          <View className="flex justify-center align-middle">
            <Pressable onPress={onPressApple}>
              <Apple />
            </Pressable>
          </View>
        </View>
      ) : (
        <></>
      )}
      <Text
        onPress={handleToggleFormType}
        className="mt-4 w-full text-center dark:text-primary-600"
      >
        {tip}
      </Text>
      {isLoginPage ? (
        <Text
          onPress={handleResetPasswordWithRandomPassword}
          className="mt-4 w-full text-center dark:text-primary-600"
        >
          {'Forgot password ? Send email to reset your password'}
        </Text>
      ) : (
        <></>
      )}
    </View>
  );
};
