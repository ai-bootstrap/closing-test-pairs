 
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Linking } from 'react-native';

export const useHandleDeepLink = () => {
  // Add this in your root component (e.g., App.js)
  useEffect(() => {
    const handleDeepLink = (event:any) => {
      const { url } = event;
      if (url.includes('/apps/check')) {
        // Navigate to the /(apps)/check page
        // Example: router.push('/(apps)/check');
      }
    };

    Linking.addEventListener('url', handleDeepLink);

    // Check if the app was launched from a deep link
    Linking.getInitialURL().then((url) => {
      if (url && url.includes('/apps/check')) {
        // Navigate to the /(apps)/check page
        router.push('/(apps)/check');
      }
    });

    return () => {
      Linking.removeAllListeners('url');
    };
  }, []);
}