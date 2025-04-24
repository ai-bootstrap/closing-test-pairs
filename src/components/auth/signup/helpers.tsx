import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';
import { router } from 'expo-router';

import { createUserProfileIsNotExist } from '@/api/supabase/user/profile';
import { supabase } from '@/services/supabase';
import { hydrateAuth } from '@/lib';
import { Alert } from 'react-native';

export const useAppleSignIn = () => {
  return async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      // Sign in via Supabase Auth.
      if (credential.identityToken) {
        const {
          error,
          data: { user },
        } = await supabase.auth.signInWithIdToken({
          provider: 'apple',
          token: credential.identityToken,
        });
        if (!error) {
          // User is signed in.
          await hydrateAuth();
          router.push('/(app)');
        }
        console.log(error, user, 'apple999');
      } else {
        throw new Error('No identityToken.');
      }
    } catch (e) {
      if (e.code === 'ERR_REQUEST_CANCELED') {
        // handle that the user canceled the sign-in flow
      } else {
        // handle other errors
      }
    }
  };
};

export const useGoogleSignIn = () => {
  return async () => {
    
    GoogleSignin.configure({
      scopes: [], // what API you want to access on behalf of the user, default is email and profile
      // ios Only
      // iosClientId:'',

      // RN need webClientId
      webClientId:
        '137136492206-9uk4uovh0h9b3e4cfbfok6ioahi39m9f.apps.googleusercontent.com',
    });
    try {
      await GoogleSignin.hasPlayServices();
      const signResp = await GoogleSignin.signIn();

      if (signResp.type === 'success') {
        const  userInfo = signResp.data
        console.log(userInfo, 'userInfo');
      if (userInfo.idToken) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: userInfo.idToken,
        });
        if (data.user?.email) {
          const name = data.user?.email.split('@')[0];
          createUserProfileIsNotExist({
            email: data.user?.email,
            display_name: name,
            uid: data.user.id,
          });
        }

        console.log(error, data, 6677);
        await hydrateAuth();
        router.replace('/(app)');
      } else {
        throw new Error('no ID token present!');
      }
      }
      
    } catch (error: any) {
      Alert.alert('Google Sign In', JSON.stringify(error));

      console.log(error, 'catch error999');
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };
};
