import * as React from 'react';
import { Item } from './item';
import { useRouter } from 'expo-router';

export const ProfileItem = () => {
  
 const router = useRouter();

  return (
    <>
      <Item
        text="user.profile" 
        onPress={() => {router.push('/user/profile')}}
      /> 
    </>
  );
};
