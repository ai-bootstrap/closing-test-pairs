import type { AxiosError } from 'axios';
import { createMutation, createQuery } from 'react-query-kit';

import { SUPABASE_BUCKET_NAME } from '@/constants';
import { getPublicURL, supabase } from '@/services/supabase';

import { TESTING_SUBMISSIONS_TABLE } from './tables';

export type SubmissionFormReqType = {
  email: string;
  app_name?: string;
  app_id: string;
  screen_shot: string;
  // tester: string;
};

export type ProofSubmissionType = SubmissionFormReqType & {
  id: string;
  created_at: string;
  email: string;
  test_back: boolean; // if test back
};

export type SubmissionQueryType = {
  id?: string;
  app_id?: string;
  created_at?: string;
};

export const useProofSubmissions = createQuery<
  ProofSubmissionType[],
  SubmissionQueryType,
  AxiosError
>({
  queryKey: ['submission'],
  fetcher: async (body: SubmissionQueryType) => {
    const _query = supabase.from(TESTING_SUBMISSIONS_TABLE).select('*');
    if (body.id) {
      _query.eq('id', body.id);
    }
    if (body.app_id) {
      _query.eq('app_id', body.app_id);
    }
    if (body.created_at) {
      _query.eq('created_at', body.created_at);
    }
    const { data, error } = await _query;

    if (error) {
      throw new Error(error.message);
    }
    const resp = await Promise.all(
      data.map(async (item) => {
        const url = await getPublicURL(item.screen_shot, SUPABASE_BUCKET_NAME);
        return {
          ...item,
          screen_shot: url,
        };
      })
    );
    return resp as ProofSubmissionType[];
  },
});

export const useSaveSubmissionForm = createMutation<
  ProofSubmissionType,
  SubmissionFormReqType,
  AxiosError
>({
  mutationKey: ['save-submission'],
  mutationFn: async (formValue) => {
    const { data, error } = await supabase
      .from(TESTING_SUBMISSIONS_TABLE)
      .insert({
        email: formValue.email,
        app_name: formValue.app_name,
        app_id: formValue.app_id,
        screen_shot: formValue.screen_shot,
        // tester: formValue.tester,
      })
      .select('*')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as ProofSubmissionType;
  },
});
