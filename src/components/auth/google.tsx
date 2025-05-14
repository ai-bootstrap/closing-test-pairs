import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import React from 'react';

export default function () {
  return (
    <GoogleSigninButton
      style={{ width: 0 }}
      size={GoogleSigninButton.Size.Icon}
      color={GoogleSigninButton.Color.Dark}
    />
  );
}
