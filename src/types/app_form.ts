import * as z from 'zod';
export const schema = z.object({
  app_name: z.string().min(1, 'App Name is required'),
  google_group_link: z.string().min(1, 'Google Group Link is required'),
  apk_link: z.string().min(1, 'Google Group Link is required'),
  web_link: z.string().min(1, 'Google Group Link is required'),
  email: z.string().optional(),
  id: z.string().optional(),
  created_at: z.string().optional(),
});

export type AppFormType = z.infer<typeof schema>;
