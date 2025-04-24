import * as AppleAuthentication from 'expo-apple-authentication';
import React from 'react';
import { Platform } from 'react-native';

export default function Auth() {
  if (Platform.OS === 'ios')
    return (
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={
          AppleAuthentication.AppleAuthenticationButtonStyle.WHITE_OUTLINE
        }
        style={{ width: 40, height: 40 }}
        cornerRadius={2}
        onPress={async () => {}}
      />
    );
  return <>{/* Implement Android Auth options. */}</>;
}
