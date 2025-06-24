import {DEFAULT_ROUTE_SETTINGS} from '@/constants';
import {AppDispatch, IUser, setIsLoggedIn, setUser} from '@/store';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';
import firestore from '@react-native-firebase/firestore';
import {AuthResult} from './auth';

type UserProfile = {
  email: string;
  displayName: string;
};

const saveUserToFirestore = async (uid: string, data: UserProfile) => {
  try {
    await firestore()
      .collection('users')
      .doc(uid)
      .set({
        ...data,
        settings: DEFAULT_ROUTE_SETTINGS,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

    await crashlytics().log('User saved to Firestore');
  } catch (error) {
    await crashlytics().log('Firestore save error');
    await crashlytics().recordError(
      error instanceof Error ? error : new Error('Firestore error'),
    );
    throw new Error('Failed to save user data');
  }
};

const updateAuthProfile = async (displayName: string) => {
  try {
    await auth().currentUser?.updateProfile({displayName});
    await auth().currentUser?.reload();
    await auth().currentUser?.getIdToken(true);

    await crashlytics().log('Auth profile updated');
  } catch (error) {
    await crashlytics().log('Auth profile update error');
    await crashlytics().recordError(
      error instanceof Error ? error : new Error('Auth update error'),
    );
    throw new Error('Failed to update user profile');
  }
};

export const completeUserRegistration = async (
  email: string,
  displayName: string,
  dispatch: AppDispatch,
) => {
  try {
    const user = auth().currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Сохраняем в Firestore
    await saveUserToFirestore(user.uid, {email, displayName});

    // Обновляем профиль аутентификации
    await updateAuthProfile(displayName);

    // Обновляем состояние приложения
    dispatch(
      setUser({
        uid: user.uid,
        email,
        displayName,
        settings: DEFAULT_ROUTE_SETTINGS,
      }),
    );

    await crashlytics().setAttributes({
      user_id: user.uid,
      user_email: email,
    });
  } catch (error) {
    await crashlytics().log('Registration completion failed');
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    await crashlytics().recordError(new Error(errorMessage));

    throw error;
  }
};

export const sendEmailVerification = async (): Promise<AuthResult> => {
  try {
    await crashlytics().log('EmailVerification: Process started');

    const currentUser = auth().currentUser;
    if (!currentUser) {
      throw new Error('auth/no-user-authenticated');
    }

    await currentUser.sendEmailVerification();

    await crashlytics().log('EmailVerification: Email sent successfully');
    await crashlytics().setAttributes({
      auth_phase: 'email_verification_sent',
      user_email: currentUser.email || 'unknown',
    });

    return {success: true};
  } catch (error) {
    let errorCode = 'internal/unknown-error';
    let errorMessage = 'Failed to send verification email';
    let shouldLogError = true;

    if (error instanceof Error) {
      if ('code' in error) {
        const firebaseError =
          error as FirebaseAuthTypes.NativeFirebaseAuthError;
        errorCode = firebaseError.code;

        switch (errorCode) {
          case 'auth/too-many-requests':
            errorMessage = 'Too many attempts. Try again later';
            shouldLogError = false;
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Network error. Check your connection';
            shouldLogError = false;
            break;
          case 'auth/user-not-found':
            errorMessage = 'User not found. Please sign in again';
            shouldLogError = false;
            break;
          case 'auth/user-token-expired':
            errorMessage = 'Session expired. Please sign in again';
            shouldLogError = false;
            break;
          default:
            errorMessage = firebaseError.message;
            shouldLogError = true;
        }
      } else {
        errorCode = error.message;
      }
    }

    if (shouldLogError) {
      const errorToReport =
        error instanceof Error ? error : new Error(errorMessage);

      await crashlytics().log(`EmailVerification Error: ${errorCode}`);
      await crashlytics().recordError(errorToReport);

      if (errorToReport.stack) {
        await crashlytics().log(errorToReport.stack);
      }
    }

    await crashlytics().setAttributes({
      auth_phase: 'email_verification_failed',
      last_error_code: errorCode,
      error_handled: String(!shouldLogError),
    });

    return {
      success: false,
      error: {code: errorCode, message: errorMessage},
    };
  }
};

export const getUser = async (
  uid: string,
  email: string,
  emailVerified: boolean,
  dispatch: AppDispatch,
  setLoading: (loading: boolean) => void,
  logoutUser: () => void,
): Promise<AuthResult> => {
  try {
    await crashlytics().log('GetUser: Process started');
    await crashlytics().setAttributes({
      auth_phase: 'user_fetch_init',
      user_id: uid,
    });

    const documentSnapshot = await firestore()
      .collection('users')
      .doc(uid)
      .get();

    if (!documentSnapshot.exists) {
      throw new Error('firestore/user-not-found');
    }

    const userData = documentSnapshot.data() as IUser;

    if (userData.displayName) {
      dispatch(setUser({...userData, email, uid}));
    }

    dispatch(setIsLoggedIn(true));
    setLoading(false);

    await crashlytics().log('GetUser: Data fetched successfully');
    return {
      success: true,
      user: {user: {uid, email}} as FirebaseAuthTypes.UserCredential,
    };
  } catch (error) {
    let errorCode = 'internal/unknown-error';
    let errorMessage = 'Failed to fetch user data';
    let shouldLogError = true;

    if (error instanceof Error) {
      errorCode = error.message;

      if (errorCode === 'firestore/user-not-found') {
        errorMessage = 'User data not found';
        shouldLogError = false;
      }
    }

    if (shouldLogError) {
      const errorToReport =
        error instanceof Error ? error : new Error(errorMessage);

      await crashlytics().log(`GetUser Error: ${errorCode}`);
      await crashlytics().recordError(errorToReport);

      if (errorToReport.stack) {
        await crashlytics().log(errorToReport.stack);
      }
    }

    await crashlytics().setAttributes({
      auth_phase: 'user_fetch_failed',
      last_error_code: errorCode,
      error_handled: String(!shouldLogError),
    });

    // Обработка по аналогии с исходным кодом
    if (emailVerified) {
      logoutUser();
    } else {
      dispatch(setIsLoggedIn(true));
      setLoading(false);
    }

    return {
      success: false,
      error: {code: errorCode, message: errorMessage},
    };
  }
};
