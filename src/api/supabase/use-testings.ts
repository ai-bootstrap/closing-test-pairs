const TABLE_NAME = "my_testings";
import { supabase } from '@/services/supabase';
import { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';


type AddToMyTestingReqType = {
  id: string;  // app 的 id
  uid: string; // 当前用户的uid
}

export const useAddToMyTestings = createMutation<boolean, AddToMyTestingReqType, AxiosError>({
  mutationKey: ['add-to-my-testings'],
  mutationFn: async (formValue) => {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert({
        ...formValue
      })
      .select('*')
      .single()

    if (error) {
      throw new Error(error.message);
    }

    return true
  },
});

