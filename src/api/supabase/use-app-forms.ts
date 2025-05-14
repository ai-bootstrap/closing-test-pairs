import type { AxiosError } from 'axios';
import { createMutation, createQuery } from 'react-query-kit';

import { supabase } from '@/services/supabase';
import { type AppFormType } from '@/types';

import { MY_TESTINGS_TABLE } from './use-testings';
export const APP_FORM_TABLE = 'app_forms';

export const saveAppForm = async (data: any) => {
  const { error } = await supabase.from(APP_FORM_TABLE).insert([data]);
  if (error) {
    console.error('Error saving app form:', error);
    return false;
  }
  return true;
};

type CreateAppFormType = AppFormType & {
  creator: string;
};

export const useCreateTestingApp = createMutation<
  boolean,
  CreateAppFormType,
  AxiosError
>({
  mutationFn: async (body) => {
    const { data } = await supabase
      .from(APP_FORM_TABLE)
      .select('*')
      .eq('apk_link', body.apk_link)
      .single();
    if (data) {
      throw Error('App form already exists');
    }
    const { error } = await supabase.from(APP_FORM_TABLE).insert([body]);
    if (error) {
      throw Error('Error saving app form:', error);
    }
    return true;
  },
});

export const useUpdateAppForm = createMutation<
  boolean,
  AppFormType,
  AxiosError
>({
  mutationFn: async (body) => {
    const { error } = await supabase
      .from(APP_FORM_TABLE)
      .update(body)
      .eq('id', body.id);
    if (error) {
      console.error('Error updating app form:', error);
      throw Error(`Error updating app form: ${error?.message}`);
    }
    return true;
  },
});

export const useAllAppForms = createQuery<AppFormType[], void, AxiosError>({
  queryKey: ['app_forms'],
  fetcher: async () => {
    const { data, error } = await supabase
      .from(APP_FORM_TABLE)
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      throw new Error('Error fetching app forms:', error);
    }
    // get myTestings of all app forms by id
    const { data: myTestings, error: myTestingsError } = await supabase
      .from(MY_TESTINGS_TABLE)
      .select('*')
      .in(
        'app_id',
        data?.map((item) => item.id)
      );

    // aggregate user_id by app_id
    const appUserIdsMap: Record<string, string[]> = {};
    myTestings?.forEach((item) => {
      if (appUserIdsMap[item.app_id]) {
        appUserIdsMap[item.app_id].push(item.user_id);
      } else {
        appUserIdsMap[item.app_id] = [item.user_id];
      }
    });

    data.forEach((item) => {
      item.testing_users = appUserIdsMap[item.id] || [];
    });

    return data;
  },
});

export const useDeleteAppForm = createMutation<boolean, string, AxiosError>({
  mutationFn: async (id) => {
    const { error } = await supabase.from(APP_FORM_TABLE).delete().eq('id', id);
    if (error) {
      console.error('Error deleting app form:', error);
      throw Error(`Error deleting app form: ${error?.message}`);
    }
    return true;
  },
});

type Variables = { uid: string };
export const useAppFormByUserId = createQuery<
  AppFormType[],
  Variables,
  AxiosError
>({
  queryKey: ['app_forms_by_user_id'],
  fetcher: async ({ uid }) => {
    const { data, error } = await supabase
      .from(APP_FORM_TABLE)
      .select('*')
      .eq('creator', uid)
      .order('created_at', { ascending: false });
    if (error) {
      throw new Error('Error fetching app forms:', error);
    }
    return data as AppFormType[];
  },
});
