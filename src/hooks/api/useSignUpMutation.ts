import {signUpUser} from '@/lib';
import {useMutation} from '@tanstack/react-query';

export const useSignUpMutation = () => {
  return useMutation({
    mutationFn: ({email, password}: {email: string; password: string}) =>
      signUpUser(email, password).then(res => {
        if (!res.success) {
          throw new Error(res.error?.message);
        }
        return res.user;
      }),
  });
};
