const TABLE_NAME = "app_forms";
import { AppFormType } from '@/types'
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

type CreateAppFormType =  AppFormType & {
  creator: string;
}

export const useCreateTestingApp = createMutation<boolean, CreateAppFormType, AxiosError>({
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

export const useUpdateAppForm = createMutation<boolean, AppFormType, AxiosError>({
  mutationFn: async (body) => { 
    const { error } = await supabase.from(TABLE_NAME).update(body).eq('id', body.id);
    if (error) {
      console.error('Error updating app form:', error);
      throw Error(`Error updating app form: ${error?.message}`);
    }
    return true
  }
});

export const useAllAppForms = createQuery<AppFormType[], void, AxiosError>({
  queryKey: ['app_forms'],  
  fetcher: async () => {
    const { data, error } = await supabase.from(TABLE_NAME).select('*').order('created_at', { ascending: false }); 
    if (error) {
      throw new Error('Error fetching app forms:', error);
    }
    return data as AppFormType[];
  }
});

export const useDeleteAppForm = createMutation<boolean, string, AxiosError>({
  mutationFn: async (id) => {   
    const { error } = await supabase.from(TABLE_NAME).delete().eq('id', id);
    if (error) {
      console.error('Error deleting app form:', error);
      throw Error(`Error deleting app form: ${error?.message}`);
    }
    return true
  }
});

type Variables = { uid: string };
export const useAppFormByUserId = createQuery<AppFormType[],Variables, AxiosError>({
  queryKey: ['app_forms_by_user_id'], 
  fetcher: async ({uid}) => {
    const { data, error } = await supabase.from(TABLE_NAME).select('*').eq('creator', uid).order('created_at', { ascending: false });
    if (error) {
      throw new Error('Error fetching app forms:', error);
    }
    return data as AppFormType[];
  }
});