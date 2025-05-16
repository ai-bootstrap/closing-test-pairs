import { Env } from 'env';
import React, { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  useForeground,
} from 'react-native-google-mobile-ads';
const bannerAdUnitId =
  Platform.OS === 'ios'
    ? 'ca-app-pub-8308256891764581/3031782660'
    : Env.GOOGLE_AD_BANNER_ID;

const adUnitId: string = __DEV__ ? TestIds.ADAPTIVE_BANNER : bannerAdUnitId;

export default function BannerAdUnit() {
  const bannerRef = useRef<BannerAd>(null);

  // (iOS) WKWebView can terminate if app is in a "suspended state", resulting in an empty banner when app returns to foreground.
  // Therefore it's advised to "manually" request a new ad when the app is foregrounded (https://groups.google.com/g/google-admob-ads-sdk/c/rwBpqOUr8m8).
  useForeground(() => {
    Platform.OS === 'ios' && bannerRef.current?.load();
  });
  useEffect(() => {
    Platform.OS === 'ios' && bannerRef.current?.load();
  });

  return (
    <BannerAd
      ref={bannerRef}
      unitId={adUnitId}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
    />
  );
}
