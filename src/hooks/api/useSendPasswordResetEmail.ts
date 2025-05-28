import {sendPasswordResetEmail} from '@/lib';
import {useMutation} from '@tanstack/react-query';

export const useSendPasswordResetEmail = () => {
  return useMutation({
    mutationFn: ({email}: {email: string}) => sendPasswordResetEmail(email),
  });
};
