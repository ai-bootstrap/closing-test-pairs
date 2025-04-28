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
import { removeToken, setToken } from '@/lib/auth/utils';
import { setUserInfo } from '@/store/user';

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
        if (userInfo.idToken) {
          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: userInfo.idToken,
          });

          // judge if the expired time is less than now
          // I want to use the logic in several places, so I put it in a function
          checkTokenAndUpdateStore(data);  
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

export const checkTokenAndUpdateStore = async (data: any) => { 
  if (data.session?.access_token && data.session?.expires_at) {
    const expiredTime = new Date(data.session.expires_at * 1000); 
    const now = new Date();
    if (expiredTime < now) {  
      console.log('token expired!');
      // clear Token
      removeToken()
      hydrateAuth();
      return;
    }
    // update userinfo in store
    const userInfo = {
      email: data.user?.email,
      display_name: data.user?.user_metadata.full_name,
      uid: data.user.id
    }
    console.log('userInfo login successful', userInfo);
  
    setUserInfo(userInfo);

    // update token in storage
    setToken({
      access: data.session.access_token,
      refresh: data.session.refresh_token,
    })
    // call hydrateAuth to update the store
    hydrateAuth();
    router.replace('/(app)');


    // const name = data.user?.email.split('@')[0];
    // createUserProfileIsNotExist({
    //   email: data.user?.email,
    //   display_name: name,
    //   uid: data.user.id,
    // });
  }
}
