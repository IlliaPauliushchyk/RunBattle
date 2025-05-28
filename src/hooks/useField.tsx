import {FormikErrors, FormikTouched} from 'formik';
import {useCallback, useState} from 'react';
import {NativeSyntheticEvent, TextInputFocusEventData} from 'react-native';

interface UseFieldParams {
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  touched?: boolean | FormikTouched<any> | FormikTouched<any>[] | undefined;
  errorMessage?:
    | string
    | string[]
    | FormikErrors<any>
    | FormikErrors<any>[]
    | undefined;
}

interface UseFieldReturn {
  handleFocus: () => void;
  handleBlur: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  error:
    | string
    | false
    | FormikErrors<any>
    | string[]
    | FormikErrors<any>[]
    | undefined;
}

export const useField = ({
  onBlur,
  touched,
  errorMessage,
}: UseFieldParams): UseFieldReturn => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(
    (event: any) => {
      if (onBlur) {
        onBlur(event);
      }
      setIsFocused(false);
    },
    [onBlur],
  );
  const error = !isFocused && touched && errorMessage;

  return {handleFocus, handleBlur, error};
};
