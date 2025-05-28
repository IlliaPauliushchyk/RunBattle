import {useField} from '@/hooks';
import {FormikErrors, FormikTouched} from 'formik';
import React, {ComponentProps, useCallback, useState} from 'react';
import {
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  TextInputFocusEventData,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {HelperText, TextInput, TouchableRipple} from 'react-native-paper';

type TextInputProps = ComponentProps<typeof TextInput>;

interface DefaultProps
  extends Omit<
    TextInputProps,
    | 'mode'
    | 'left'
    | 'right'
    | 'secureTextEntry'
    | 'onBlur'
    | 'onFocus'
    | 'editable'
    | 'style'
    | 'contentStyle'
  > {
  errorMessage?:
    | string
    | string[]
    | FormikErrors<any>
    | FormikErrors<any>[]
    | undefined;
  secureTextEntry?: boolean;
  isSecure?: boolean;
  showSecureEntryIcon?: boolean;
  touchableStyle?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  rightIcon?: React.ReactNode;
  touched?: boolean | FormikTouched<any> | FormikTouched<any>[] | undefined;
  inputStyle?: StyleProp<TextStyle>;
  setSecureTextEntry?: () => void;
  multiline?: boolean;
  numberOfLines?: number;
  leftIcon?: React.ReactNode;
  onPress?: () => void;
}

export const Input = ({
  errorMessage,
  secureTextEntry = false,
  isSecure,
  showSecureEntryIcon,
  touchableStyle,
  inputContainerStyle,
  onBlur,
  rightIcon,
  touched,
  inputStyle,
  setSecureTextEntry,
  multiline,
  numberOfLines,
  leftIcon,
  onPress,
  ...otherProps
}: DefaultProps) => {
  const [secureEntry, setSecureEntry] = useState(secureTextEntry);

  const {handleFocus, handleBlur, error} = useField({
    onBlur,
    touched,
    errorMessage,
  });

  const handleRightIconPress = useCallback(() => {
    setSecureTextEntry?.();
    setSecureEntry(current => !current);
  }, [setSecureTextEntry]);

  const icon = showSecureEntryIcon ? (
    <TextInput.Icon
      icon={secureEntry ? 'eye-outline' : 'eye'}
      onPress={handleRightIconPress}
    />
  ) : rightIcon ? (
    rightIcon
  ) : null;

  return (
    <>
      <TouchableRipple
        borderless
        disabled={!onPress}
        onPress={onPress}
        style={touchableStyle}>
        <TextInput
          mode="outlined"
          left={leftIcon}
          numberOfLines={numberOfLines}
          multiline={multiline}
          onFocus={handleFocus}
          onBlur={handleBlur}
          error={!!error}
          right={icon}
          secureTextEntry={!!(secureEntry || isSecure)}
          style={[inputContainerStyle, !error && styles.notErrorInput]}
          contentStyle={[inputStyle, multiline && styles.multilineInput]}
          allowFontScaling={false}
          editable={!onPress}
          {...otherProps}
        />
      </TouchableRipple>
      {error ? (
        <HelperText type="error" visible={true}>
          {String(error)}
        </HelperText>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  multilineInput: {
    textAlignVertical: 'top',
    height: 130,
  },
  notErrorInput: {
    marginBottom: 18,
  },
});
