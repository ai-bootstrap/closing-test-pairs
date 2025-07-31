import { type AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { supabase } from '@/services/supabase';

import { LOG_TABLE } from './tables';

type ReqType = {
  content: string;
};

export const useLogTrack = createMutation<boolean, ReqType, AxiosError>({
  mutationKey: ['add-to-log_track'],
  mutationFn: async (formValue) => {
    const { error } = await supabase
      .from(LOG_TABLE)
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
