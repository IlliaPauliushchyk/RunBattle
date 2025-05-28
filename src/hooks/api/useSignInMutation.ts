import {signInUser} from '@/lib';
import {useMutation} from '@tanstack/react-query';

export const useSignInMutation = () => {
  return useMutation({
    mutationFn: ({email, password}: {email: string; password: string}) =>
      signInUser(email, password).then(res => {
        if (!res.success) {
          throw new Error(res.error?.message);
        }
        return res.user;
      }),
  });
};
