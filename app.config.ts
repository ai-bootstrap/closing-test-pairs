/* eslint-disable max-lines-per-function */
import type { ConfigContext, ExpoConfig } from '@expo/config';
import type { AppIconBadgeConfig } from 'app-icon-badge/types';

import { ClientEnv, Env } from './env';

const appIconBadgeConfig: AppIconBadgeConfig = {
  enabled: Env.APP_ENV !== 'production',
  badges: [
    {
      text: Env.APP_ENV,
      type: 'banner',
      color: 'white',
    },
    {
      text: Env.VERSION.toString(),
      type: 'ribbon',
      color: 'white',
    },
  ],
};

console.log(Env.PACKAGE, 'Env.PACKAGE');

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: Env.NAME,
  description: `${Env.NAME}`,
  owner: Env.EXPO_ACCOUNT_OWNER,
  scheme: Env.SCHEME,
  slug: 'ClosingTestPairs',
  version: Env.VERSION.toString(),
  orientation: 'portrait',
  icon: './assets/image.png',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: Env.BUNDLE_ID,
    config: {
      usesNonExemptEncryption: false, // Avoid the export compliance warning on the app store
    },
  },
  experiments: {
    typedRoutes: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/image.png',
      backgroundColor: '#2E3C4B',
    },
    config: {
      // googleMobileAdsAppId: Env.GOOGLE_AD_APP_ID,
      googleMobileAdsAutoInit: true,
    },
    versionCode: 4,
    package: Env.PACKAGE,
    intentFilters: [
      {
        action: 'VIEW',
        autoVerify: true,
        data: {
          scheme: Env.SCHEME,
          host: '*', //
          // pathPrefix: '/apps',
        },
        category: ['BROWSABLE', 'DEFAULT'],
      },
    ],
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro',
  },
  plugins: [
    [
      'react-native-google-mobile-ads',
      {
        androidAppId: Env.GOOGLE_AD_APP_ID,
        android: {
          playServicesAdsVersion: '22.5.0',
        },
      },
    ],
    [
      'expo-splash-screen',
      {
        backgroundColor: '#2E3C4B',
        image: './assets/image.png',
        imageWidth: 150,
      },
    ],
    [
      'expo-font',
      {
        fonts: ['./assets/fonts/Inter.ttf'],
      },
    ],
    [
      '@react-native-google-signin/google-signin',
      // {
      // WE MAY DON'T NEED THIS FOR ANDROID ONLY APP
      //   "iosUrlScheme": "com.googleusercontent.apps._some_id_here_"
      // }
    ],
    'expo-localization',
    'expo-router',
    ['app-icon-badge', appIconBadgeConfig],
    ['react-native-edge-to-edge'],
    [
      'expo-build-properties',
      {
        android: {
          // compileSdkVersion: 35,
          // targetSdkVersion: 35,
          // buildToolsVersion: '35.0.0',
          // MYAPP_RELEASE_STORE_FILE: 'my-release-key.keystore',
          // MYAPP_RELEASE_KEY_ALIAS: 'my-key-alias',
          // MYAPP_RELEASE_STORE_PASSWORD: '!2sdlfe&sU9_&3',
          // MYAPP_RELEASE_KEY_PASSWORD: '!2sdlfe&sU9_&3'
          // kotlinVersion: '1.9.5',
          // googlePlayServicesAdsVersion: '22.5.0',
        },
      },
    ],
  ],
  extra: {
    ...ClientEnv,
    eas: {
      projectId: Env.EAS_PROJECT_ID,
    },
  },
});
