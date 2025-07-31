// hooks/useHandleDeepLink.tsx
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Linking } from 'react-native';

type DeepLinkParams = {
  email?: string;
  appName?: string;
  [key: string]: string | undefined;
};

export default function useHandleDeepLink(screenPath: string) {
  const router = useRouter();

  const parseDeepLink = (url: string): DeepLinkParams | null => {
    try {
      // Manually parse URL since Expo's Linking doesn't provide full URL parsing
      const scheme = 'ClosingTestPairs://';
      if (!url.startsWith(scheme)) return null;

      const queryString = url.split('?')[1];
      if (!queryString) return {};
      console.log(queryString, 'queryString', url);

      const params: DeepLinkParams = {};
      queryString.split('&').forEach((pair) => {
        const [key, value] = pair.split('=');
        params[key] = decodeURIComponent(value || '');
      });

      return params;
    } catch (error) {
      console.error('Error parsing deep link:', error);
      return null;
    }
  };

  const handleDeepLink = (url: string | null) => {
    if (!url) return;

    const params = parseDeepLink(url);
    if (!params) return;

    console.log('Deep link params:', params);
    // router.push({
    //   pathname: screenPath,
    //   params,
    // });
  };

  useEffect(() => {
    // Listen for incoming deep links when app is running
    const subscription = Linking.addEventListener('url', (event) => {
      console.log('Deep link event1:', event);
      handleDeepLink(event.url);
    });

    // Handle deep link if app was launched from one
    Linking.getInitialURL().then((url) => {
      console.log('Deep link url:', url);
      handleDeepLink(url);
    });

    return () => {
      subscription.remove();
    };
  }, []);
}
