import {getUser} from '@/lib';
import {useMutation} from '@tanstack/react-query';
import {useAppDispatch} from '../redux';

type Props = {
  uid: string;
  email: string;
  emailVerified: boolean;
  setLoading: (loading: boolean) => void;
  logoutUser: () => void;
};

export const useGetUserDataMutation = () => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: ({uid, email, emailVerified, setLoading, logoutUser}: Props) =>
      getUser(uid, email, emailVerified, dispatch, setLoading, logoutUser),
  });
};
