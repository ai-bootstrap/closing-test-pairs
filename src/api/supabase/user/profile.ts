import { supabase } from '@/services/supabase';
import type { IUserInfo } from '@/types';

export const getProfile = async (uid: string): Promise<IUserInfo> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('uid', uid);

  if (error) throw error;
  return data[0];
};

export const getProfileByIds = async (uids: Array<string>): Promise<IUserInfo[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .in('uid', uids);

  if (error) throw error;
  return data;
};

export const updateProfile = async (data: {
  uid: string;
  display_name: string;
}) => {
  console.log(data);
  return supabase
    .from('profiles')
    .update({
      display_name: data.display_name,
    })
    .eq('uid', data.uid)
    .select();
};

export const createUserProfileIsNotExist = async (body: {
  email: string;
  display_name: string;
  uid: string;
}) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', body.email);
  console.log(data, error, '--uuu', body);
  if (!data || !data.length) {
    await supabase.from('profiles').upsert(body, { onConflict: 'email' });
  }
};
