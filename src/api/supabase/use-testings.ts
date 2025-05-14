import { type AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { supabase } from '@/services/supabase';
import { type AppFormType } from '@/types';

import { APP_FORM_TABLE } from './use-app-forms';
export const MY_TESTINGS_TABLE = 'my_testings';

type AddToMyTestingReqType = {
  app_id: string; // app 的 id
  user_id: string; // 当前用户的uid
};

export const useAddToMyTestings = createMutation<
  boolean,
  AddToMyTestingReqType,
  AxiosError
>({
  mutationKey: ['add-to-my-testings'],
  mutationFn: async (formValue) => {
    const { data, error } = await supabase
      .from(MY_TESTINGS_TABLE)
      .insert({
        ...formValue,
      })
      .select('*')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return true;
  },
});

export const useGetMyTestings = createMutation<
  AppFormType[],
  string,
  AxiosError
>({
  mutationKey: ['get-my-testings'],
  mutationFn: async (uid) => {
    const { data, error } = await supabase
      .from(MY_TESTINGS_TABLE)
      .select('*')
      .eq('user_id', uid);

    if (error) {
      throw new Error(error.message);
    }

    if (data?.length) {
      const { data: appForms, error: appFormsError } = await supabase
        .from(APP_FORM_TABLE)
        .select('*')
        .in(
          'id',
          data.map((item) => item.app_id)
        );

      if (appFormsError) {
        throw new Error(appFormsError.message);
      }
      return appForms as AppFormType[];
    }
    return [] as AppFormType[];
  },
});
