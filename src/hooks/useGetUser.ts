import {IUser, removeLogin, selectIsLoggedIn, setLogin, setUser} from '@/store';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

export const useGetUser = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);
  const [isWaitForVerification, setIsWaitForVerification] = useState(false);

  const logoutUser = () => {
    dispatch(removeLogin());
    setLoading(false);
  };

  const onAuthStateChanged = async (user: any) => {
    if (user) {
      const emailVerified = user.emailVerified;

      if (!emailVerified) {
        setIsWaitForVerification(true);
        const onIdTokenChangedUnsubscribe = auth().onIdTokenChanged(
          userData => {
            const unsubscribeSetInterval = setTimeout(() => {
              auth().currentUser?.reload();
              auth().currentUser?.getIdToken(true);
            }, 10000);

            if (userData && userData.emailVerified) {
              clearInterval(unsubscribeSetInterval);
              onAuthStateChanged(userData);
              return onIdTokenChangedUnsubscribe();
            }
          },
        );
      } else {
        setIsWaitForVerification(false);
      }

      const {email, uid} = user;

      setLoading(true);
      await firestore()
        .collection('users')
        .doc(uid)
        .get()
        .then(responce => {
          const data = responce.data();
          const {displayName} = data as IUser;

          dispatch(setUser({displayName, email}));
          dispatch(setLogin({isWaitForVerification, isLoggedIn: true}));

          setLoading(false);
        })
        .catch(() => {
          dispatch(setLogin({isLoggedIn: false, isWaitForVerification: false}));
          logoutUser();
        });
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
