import {updateRouteSettings} from '@/lib';
import {ISettings, selectUser} from '@/store';
import {useMutation} from '@tanstack/react-query';
import {useAppDispatch, useAppSelector} from '../redux';

export const useUpdateRouteSettingsMutation = () => {
  const dispatch = useAppDispatch();
  const {uid} = useAppSelector(selectUser);

  return useMutation({
    mutationFn: (settings: ISettings) =>
      updateRouteSettings(uid!, settings, dispatch),
  });
};
