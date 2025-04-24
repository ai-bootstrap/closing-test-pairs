const TABLE_NAME = "app_forms";
import { AppFormType } from '@/app/(app)/AddAppScreen';
import { supabase } from '@/services/supabase';
import type { AxiosError } from 'axios';
import { createMutation, createQuery } from 'react-query-kit';
// rewrite this function with useQuery and useMutation from react-query
// import { useQuery, useMutation } from 'react-query'; 

export const saveAppForm = async (data: any) => {
  const { error } = await supabase.from(TABLE_NAME).insert([data]);
  if (error) {
    console.error('Error saving app form:', error);
    return false;
  }
  return true;
}

export const useSaveAppForm = createMutation<boolean, AppFormType, AxiosError>({
  mutationFn: async (body) => { 
    const {data} = await supabase.from(TABLE_NAME).select('*').eq('apk_link', body.apk_link).single();
    if (data) {
      throw Error('App form already exists');
    }
    const { error } = await supabase.from(TABLE_NAME).insert([body]);
    if (error) {
      throw Error('Error saving app form:', error);
    }
    return true
  }
});

export const useAllAppForms = createQuery<AppFormType[], void, AxiosError>({
  queryKey: ['app_forms'],  
  fetcher: async () => {
    const { data, error } = await supabase.from(TABLE_NAME).select('*');
    if (error) {
      throw new Error('Error fetching app forms:', error);
    }
    return data as AppFormType[];
  }
});