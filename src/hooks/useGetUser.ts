import {selectIsLoggedIn, setIsLoggedIn} from '@/store';
import auth from '@react-native-firebase/auth';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useGetUserDataMutation} from './api';

export const useGetUser = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const dispatch = useDispatch();
  const {mutate: getUser} = useGetUserDataMutation();

  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);
  const [isWaitForVerification, setIsWaitForVerification] = useState(false);

  const logoutUser = () => {
    dispatch(setIsLoggedIn(false));
    setLoading(false);
  };

  const checkIsEmailVerified = (emailVerified: boolean) => {
    if (!emailVerified) {
      setIsWaitForVerification(true);
      const onIdTokenChangedUnsubscribe = auth().onIdTokenChanged(userData => {
        const unsubscribeSetInterval = setTimeout(() => {
          auth().currentUser?.reload();
          auth().currentUser?.getIdToken(true);
        }, 10000);

        if (userData && userData.emailVerified) {
          clearInterval(unsubscribeSetInterval);
          onAuthStateChanged(userData);
          return onIdTokenChangedUnsubscribe();
        }
      });
    } else {
      setIsWaitForVerification(false);
    }
  };

  const onAuthStateChanged = async (user: any) => {
    if (user) {
      const {email, uid, emailVerified} = user;

      checkIsEmailVerified(emailVerified);
      setLoading(true);

      await getUser({uid, email, emailVerified, setLoading, logoutUser});
    } else {
      logoutUser();
    }
    if (initializing) {
      setInitializing(false);
    }
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {initializing, isWaitForVerification, loading, isLoggedIn};
};
