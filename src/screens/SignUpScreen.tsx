import {AuthFormWrapper} from '@/components';
import {useSaveUserMutation, useSignUpMutation} from '@/hooks';
import React from 'react';
import {SignUpForm} from '../forms/SignUpForm';

export interface ISighUpValues {
  displayName: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export const SignUpScreen = () => {
  const {
    mutateAsync: signUp,
    isPending,
    error: signUpError,
  } = useSignUpMutation();
  const {mutateAsync: saveUser, error: userError} = useSaveUserMutation();

  const initialValues = {
    displayName: '',
    email: '',
    password: '',
    password_confirmation: '',
  } as ISighUpValues;

  const handleSubmit = async (values: ISighUpValues): Promise<void> => {
    try {
      const {email, password, displayName} = values;

      await signUp({email, password});
      await saveUser({email, displayName});
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthFormWrapper type="signUp">
      <SignUpForm
        onSubmit={handleSubmit}
        initialValues={initialValues}
        loading={isPending}
        error={signUpError || userError}
      />
    </AuthFormWrapper>
  );
};
