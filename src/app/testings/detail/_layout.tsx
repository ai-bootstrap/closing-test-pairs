import { Stack } from 'expo-router';
import React from 'react';

import CommunityProofsScreen from './[id]';

export default function CommunityProofsLayout() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Today's Proofs",
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <CommunityProofsScreen />
    </>
  );
}
