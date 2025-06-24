import {AppButton, AppText, Input} from '@/components';
import {Screens} from '@/constants';
import {isErrorsExist} from '@/utils';
import {useNavigation} from '@react-navigation/native';
import {useFormik} from 'formik';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet} from 'react-native';
import {
  HelperText,
  TextInput,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import * as Yup from 'yup';

export const signInValidationSchema = (t: any) =>
  Yup.object({
    email: Yup.string()
      .required(t('validation.emailValidation'))
      .email(t('validation.emailFormatValidation'))
      .max(64, t('validation.max64Validation')),
    password: Yup.string().required(t('validation.passwordValidation')),
  });

export const SignInForm = ({onSubmit, initialValues, loading, error}: any) => {
  const navigation = useNavigation<any>();

  const {t} = useTranslation();
  const {colors} = useTheme();

  const formik = useFormik({
    initialValues,
    validationSchema: signInValidationSchema(t),
    onSubmit,
  });

  const {
    values,
    touched,
    errors,
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
    resetForm,
  } = formik;

  useEffect(() => {
    return () => {
      resetForm();
    };
  }, [resetForm]);

  const onChangeInput = (value: any, field: string) => {
    const valueWithoutSpaces = value.replace(/\s/g, '');
    setFieldValue(field, valueWithoutSpaces);
  };

  const isContinueButtonDisabled = isErrorsExist(errors);

  const goToForgotPassword = () => navigation.navigate(Screens.forgotPassword);

  return (
    <>
      <AppText mb={20} variant="headlineMedium" fontWeight="bold">
        {t('titles.logIn')}
      </AppText>
      <Input
        leftIcon={<TextInput.Icon icon="email-outline" />}
        label={t('inputs.inputEmailLabel')}
        placeholder={t('inputs.inputEmailPlaceholder')}
        onChangeText={handleChange('email')}
        onBlur={handleBlur('email')}
        value={values.email}
        keyboardType="email-address"
        errorMessage={errors.email}
        touched={touched.email}
      />
      <Input
        leftIcon={<TextInput.Icon icon="lock-outline" />}
        label={t('inputs.inputPasswordLabel')}
        placeholder={t('inputs.inputPasswordPlaceholder')}
        onChangeText={(value: any) => onChangeInput(value, 'password')}
        onBlur={handleBlur('password')}
        value={values.password}
        secureTextEntry
        showSecureEntryIcon
        errorMessage={errors.password}
        touched={touched.password}
      />
      <TouchableRipple
        borderless
        style={styles.forgotPassword}
        onPress={goToForgotPassword}>
        <AppText mt={-3} color={colors.primary} size={14}>
          {t('buttons.forgotPassword')}
        </AppText>
      </TouchableRipple>
      <AppButton
        mt={20}
        loading={loading}
        disabled={isContinueButtonDisabled || loading}
        onPress={handleSubmit}>
        {t('buttons.logIn')}
      </AppButton>
      {error ? (
        <HelperText type="error">
          {String(error?.message ? error.message : error)}
        </HelperText>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  forgotPassword: {alignSelf: 'flex-end'},
});
