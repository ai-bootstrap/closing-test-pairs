import { useRouter } from 'expo-router';
import * as React from 'react';

import { Item } from './item';

export const ProfileItem = () => {
  const router = useRouter();

  return (
    <>
      <Item
        text="user.profile"
        onPress={() => {
          router.push('/user/profile');
        }}
      />
    </>
  );
};
