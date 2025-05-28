import {sendEmailVerification} from '@/lib';
import {useMutation} from '@tanstack/react-query';

export const useSendEmailVerification = () => {
  return useMutation({
    mutationFn: () => sendEmailVerification(),
  });
};
