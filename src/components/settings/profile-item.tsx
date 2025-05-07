import * as React from 'react';

import type { OptionType } from '@/components/ui';
import { Options, useModal } from '@/components/ui';
import { useSelectedLanguage } from '@/lib';
import { translate } from '@/lib';
import type { Language } from '@/lib/i18n/resources';

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
