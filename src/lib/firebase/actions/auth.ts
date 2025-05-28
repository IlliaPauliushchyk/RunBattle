import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';

export type AuthResult = {
  success: boolean;
  user?: FirebaseAuthTypes.UserCredential;
  error?: {
    code: string;
    message: string;
  };
};

export const signUpUser = async (
  email: string,
  password: string,
): Promise<AuthResult> => {
  try {
    await crashlytics().log('SignUp: Process started');
    await crashlytics().setAttributes({
      auth_phase: 'signup_init',
      user_email: email,
    });

    if (!email || !password) {
      throw new Error('validation/credentials-required');
    }

    const userCredential = await auth().createUserWithEmailAndPassword(
      email,
      password,
    );

    await crashlytics().log('SignUp: Registration successful');
    return {success: true, user: userCredential};
  } catch (error) {
    let errorCode = 'internal/unknown-error';
    let errorMessage = 'Registration failed. Please try again';
    let shouldLogError = true;

    if (error instanceof Error) {
      // Обработка Firebase ошибок
      if ('code' in error) {
        const firebaseError =
          error as FirebaseAuthTypes.NativeFirebaseAuthError;
        errorCode = firebaseError.code;

        switch (errorCode) {
          case 'auth/email-already-in-use':
            errorMessage = 'Email is already registered';
            shouldLogError = false;
            break;
          case 'auth/invalid-email':
            errorMessage = 'Please enter a valid email address';
            shouldLogError = false;
            break;
          case 'auth/weak-password':
            errorMessage = 'Password must be at least 6 characters';
            shouldLogError = false;
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Network error. Check your connection';
            shouldLogError = false;
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many attempts. Try again later';
            shouldLogError = false;
            break;
          case 'auth/operation-not-allowed':
            errorMessage = 'Email/password accounts are not enabled';
            shouldLogError = false;
            break;
          default:
            // Необработанные Firebase ошибки
            errorMessage = firebaseError.message;
            shouldLogError = true;
        }
      } else {
        // Внутренние ошибки приложения
        errorCode = error.message;
        errorMessage = 'Internal application error';
      }
    }

    // Логирование только необработанных ошибок
    if (shouldLogError) {
      const errorToReport =
        error instanceof Error ? error : new Error(errorMessage);

      await crashlytics().log(`SignUp Error: ${errorCode}`);
      await crashlytics().recordError(errorToReport);

      if (errorToReport.stack) {
        await crashlytics().log(errorToReport.stack);
      }
    }

    await crashlytics().setAttributes({
      auth_phase: 'signup_failed',
      last_error_code: errorCode,
      error_handled: String(!shouldLogError),
    });

    return {
      success: false,
      error: {code: errorCode, message: errorMessage},
    };
  }
};

export const signInUser = async (
  email: string,
  password: string,
): Promise<AuthResult> => {
  try {
    await crashlytics().log('SignIn: Process started');
    await crashlytics().setAttributes({
      auth_phase: 'signin_init',
      user_email: email,
    });

    if (!email || !password) {
      throw new Error('validation/credentials-required');
    }

    const userCredential = await auth().signInWithEmailAndPassword(
      email,
      password,
    );

    await crashlytics().log('SignIn: Authentication successful');
    return {success: true, user: userCredential};
  } catch (error) {
    let errorCode = 'internal/unknown-error';
    let errorMessage = 'Authentication failed. Please try again';
    let shouldLogError = true;

    if (error instanceof Error) {
      if ('code' in error) {
        const firebaseError =
          error as FirebaseAuthTypes.NativeFirebaseAuthError;
        errorCode = firebaseError.code;

        switch (errorCode) {
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address';
            shouldLogError = false;
            break;
          case 'auth/user-disabled':
            errorMessage = 'Account has been disabled';
            shouldLogError = false;
            break;
          case 'auth/user-not-found':
            errorMessage = 'Account not found';
            shouldLogError = false;
            break;
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password';
            shouldLogError = false;
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many attempts. Try again later';
            shouldLogError = false;
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Network error. Check your connection';
            shouldLogError = false;
            break;
          case 'auth/invalid-credential':
            errorMessage = 'Invalid login credentials';
            shouldLogError = false;
            break;
          case 'auth/operation-not-allowed':
            errorMessage = 'Email/password login is disabled';
            shouldLogError = false;
            break;
          default:
            errorMessage = firebaseError.message;
            shouldLogError = true;
        }
      } else {
        errorCode = error.message;
        errorMessage = 'Internal application error';
      }
    }

    // Логирование только критических ошибок
    if (shouldLogError) {
      const errorToReport =
        error instanceof Error ? error : new Error(errorMessage);

      await crashlytics().log(`SignIn Error: ${errorCode}`);
      await crashlytics().recordError(errorToReport);

      if (errorToReport.stack) {
        await crashlytics().log(errorToReport.stack);
      }
    }

    await crashlytics().setAttributes({
      auth_phase: 'signin_failed',
      last_error_code: errorCode,
      error_handled: String(!shouldLogError),
    });

    return {
      success: false,
      error: {code: errorCode, message: errorMessage},
    };
  }
};

export const sendPasswordResetEmail = async (
  email: string,
): Promise<AuthResult> => {
  try {
    await crashlytics().log('PasswordReset: Process started');
    await crashlytics().setAttributes({
      auth_phase: 'password_reset_init',
      user_email: email,
    });

    if (!email) {
      throw new Error('validation/email-required');
    }

    await auth().sendPasswordResetEmail(email);

    await crashlytics().log('PasswordReset: Email sent successfully');
    await crashlytics().setAttributes({
      auth_phase: 'password_reset_sent',
    });

    return {success: true};
  } catch (error) {
    let errorCode = 'internal/unknown-error';
    let errorMessage = 'Failed to send password reset email';
    let shouldLogError = true;

    if (error instanceof Error) {
      if ('code' in error) {
        const firebaseError =
          error as FirebaseAuthTypes.NativeFirebaseAuthError;
        errorCode = firebaseError.code;

        switch (errorCode) {
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address';
            shouldLogError = false;
            break;
          case 'auth/user-not-found':
            errorMessage = 'No account found with this email';
            shouldLogError = false;
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many attempts. Try again later';
            shouldLogError = false;
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Network error. Check your connection';
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

      await crashlytics().log(`PasswordReset Error: ${errorCode}`);
      await crashlytics().recordError(errorToReport);

      if (errorToReport.stack) {
        await crashlytics().log(errorToReport.stack);
      }
    }

    await crashlytics().setAttributes({
      auth_phase: 'password_reset_failed',
      last_error_code: errorCode,
      error_handled: String(!shouldLogError),
    });

    return {
      success: false,
      error: {code: errorCode, message: errorMessage},
    };
  }
};
