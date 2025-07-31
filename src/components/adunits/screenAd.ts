import { AppOpenAd, TestIds } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__
  ? TestIds.APP_OPEN
  : 'ca-app-pub-8308256891764581/7728843054';

export const appOpenAd = AppOpenAd.createForAdRequest(adUnitId, {
  keywords: ['education', 'Japanese'],
});

// Preload an app open ad
// appOpenAd.load();

// // Show the app open ad when user brings the app to the foreground.
// appOpenAd.show();
