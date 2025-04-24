const TABLE_NAME = "app_forms";
import { AppFormType } from '@/app/(app)/AddAppScreen';
import { supabase } from '@/services/supabase';
import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';
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
  mutationFn: async (data) => { 
    const { error } = await supabase.from(TABLE_NAME).insert([data]);
    if (error) {
      console.error('Error saving app form:', error);
      return false;
    }
    return true;
  }
});