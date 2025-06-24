import {AppDispatch, ISettings, setUserSettings} from '@/store';
import crashlytics from '@react-native-firebase/crashlytics';
import firestore from '@react-native-firebase/firestore';
import {AuthResult} from './auth';

export const updateRouteSettings = async (
  uid: string,
  settings: ISettings,
  dispatch: AppDispatch,
): Promise<AuthResult> => {
  try {
    await crashlytics().log('UpdateRouteSettings: Process started');
    await crashlytics().setAttributes({
      auth_phase: 'route_settings_update_init',
      user_id: uid,
    });

    await firestore()
      .collection('users')
      .doc(uid)
      .update({
        settings: {
          difficulty: settings.difficulty,
          surface: settings.surface,
          routeCount: settings.routeCount,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        },
      });

    dispatch(setUserSettings(settings));

    await crashlytics().log(
      'UpdateRouteSettings: Settings updated successfully',
    );
    return {success: true};
  } catch (error) {
    let errorCode = 'internal/unknown-error';
    let errorMessage = 'Failed to update user settings';
    let shouldLogError = true;

    if (error instanceof Error) {
      errorCode = error.message;

      if (errorCode.includes('not-found')) {
        errorMessage = 'User document not found';
        shouldLogError = false;
      } else if (errorCode.includes('permission-denied')) {
        errorMessage = 'Permission denied';
        shouldLogError = false;
      } else if (errorCode.includes('unavailable')) {
        errorMessage = 'Service unavailable. Try again later';
        shouldLogError = false;
      }
    }

    if (shouldLogError) {
      const errorToReport =
        error instanceof Error ? error : new Error(errorMessage);

      await crashlytics().log(`UpdateRouteSettings Error: ${errorCode}`);
      await crashlytics().recordError(errorToReport);

      if (errorToReport.stack) {
        await crashlytics().log(errorToReport.stack);
      }
    }

    await crashlytics().setAttributes({
      auth_phase: 'route_settings_update_failed',
      last_error_code: errorCode,
      error_handled: String(!shouldLogError),
    });

    return {
      success: false,
      error: {code: errorCode, message: errorMessage},
    };
  }
};
