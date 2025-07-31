import axios from 'axios';
import { router } from 'expo-router';

// const WORKERS_URL = `http://172.20.10.3:3000`;
import { getCurrentUserAnnoAuthorization } from '@/services/supabase';

export const WORKERS_URL = `https://api.kacoka.co`;
export const client = axios.create({
  baseURL: WORKERS_URL,
  headers: {
    'content-type': 'application/json',
  },
});

client.interceptors.request.use(async (config: any) => {
  if (config.skipAuth) return config;
  const token = await getCurrentUserAnnoAuthorization();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    router.navigate('/login');
  }
  return config;
});

export const RESET_PASSWORD_URL = `https://kacoka.co/reset-password`;
