import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

export default function WebRedirectScreen() {
  useEffect(() => {
    // Redirect to your app's deep link
    WebBrowser.openBrowserAsync(
      'https://your-expo-project.web.app/redirect.html'
    );
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Redirecting to app...</Text>
    </View>
  );
}
