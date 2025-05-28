import {completeUserRegistration} from '@/lib';
import {useMutation} from '@tanstack/react-query';
import {useAppDispatch} from '../redux';

export const useSaveUserMutation = () => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: ({email, displayName}: {email: string; displayName: string}) =>
      completeUserRegistration(email, displayName, dispatch),
  });
};
