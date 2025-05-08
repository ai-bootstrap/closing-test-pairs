import * as z from 'zod';
export const schema = z.object({
  app_name: z.string().min(1, 'App Name is required'),
  google_group_link: z.string().min(1, 'Google Group Link is required'),
  apk_link: z.string().min(1, 'Google Group Link is required'),
  web_link: z.string().min(1, 'Google Group Link is required'),
  email: z.string().optional()
})

export type AppFormType = z.infer<typeof schema> & {
  id?: string;
  created_at?: string; 
  creator?: string; // creator uid
  testing_days?: number; // testing days
}


export type MyTestingsItemType = {
  id: string;  
  app_id: string;  
  user_id: string; 
  created_at?: string;
}