const TABLE_NAME = "submissions"; 
import { supabase } from '@/services/supabase';
import { AppFormType } from '@/types';
import type { AxiosError } from 'axios';
import { createMutation, createQuery } from 'react-query-kit';


export type SubmissionFormReqType = {
  email: string;
  app_name: string;
  // tester: string;
}

export type SubmissionFormType = SubmissionFormReqType & {
  id: number;
  created_at: string;
}


export const useSubmissions = createQuery<SubmissionFormType[], AppFormType, AxiosError>({
  queryKey: ['submission'],
  fetcher: async (formValue) => {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')

    if (error) {
      throw new Error(error.message);
    }

    return data as SubmissionFormType[];
  }
});

export const useSaveSubmissionForm = createMutation<SubmissionFormType, SubmissionFormReqType, AxiosError>({
  mutationKey: ['save-submission'],
  mutationFn: async (formValue) => {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert({
        email: formValue.email,
        app_name: formValue.app_name,
        // tester: formValue.tester,
      })
      .select('*')
      .single()

    if (error) {
      throw new Error(error.message);
    }

    return data as SubmissionFormType;
  },
});

