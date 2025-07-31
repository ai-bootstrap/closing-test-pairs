import * as z from 'zod';
export const schema = z.object({
  app_name: z.string().min(1, 'App Name is required'),
  google_group_link: z.string().optional(),
  apk_link: z.string().min(1, 'Google Group Link is required'),
  web_link: z.string().optional(),
  email: z.string().optional(),
});

export type AppForm = z.infer<typeof schema>;

export type AppFormType = AppForm & {
  id: string;
  created_at: string;
  creator: string; // creator uid
  testing_days?: number; // testing days
  testing_users?: string[];
};

export type AppFormRequestType = Partial<AppFormType>;

export type MyTestingsItemType = {
  id: string;
  app_id: string;
  user_id: string;
  created_at?: string;
};
