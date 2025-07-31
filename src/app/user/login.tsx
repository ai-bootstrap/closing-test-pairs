import { useRouter } from 'expo-router';
import React from 'react';

import { AuthComp } from '@/components/auth/signup/auth-comp';
import type { LoginFormProps } from '@/components/login-form';
import { FocusAwareStatusBar } from '@/components/ui';
import { useAuth } from '@/lib';

export default function Login() {
  const router = useRouter();
  const signIn = useAuth.use.signIn();

  const onSubmit: LoginFormProps['onSubmit'] = (data) => {
    console.log(data);
    signIn({ access: 'access-token', refresh: 'refresh-token' });
    router.push('/');
  };
  return (
    <>
      <FocusAwareStatusBar />
      <AuthComp />
      {/* <SignUpSelectors /> */}
    </>
  );
}
