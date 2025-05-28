import {AuthFormWrapper} from '@/components';
import {useSignInMutation} from '@/hooks';
import React from 'react';
import {SignInForm} from '../forms/SignInForm';

export interface ISighInValues {
  email: string;
  password: string;
}

export const SignInScreen = () => {
  const {mutateAsync: signIn, isPending, error} = useSignInMutation();

  const initialValues = {
    email: '',
    password: '',
  } as ISighInValues;

  const handleSubmit = async (values: ISighInValues): Promise<void> => {
    try {
      const {email, password} = values;

      const user = await signIn({email, password});

      if (user) {
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthFormWrapper type="signIn">
      <SignInForm
        onSubmit={handleSubmit}
        initialValues={initialValues}
        loading={isPending}
        error={error}
      />
    </AuthFormWrapper>
  );
};
