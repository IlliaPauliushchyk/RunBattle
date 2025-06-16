import {AppButton, AppText, Input} from '@/components';
import {isErrorsExist} from '@/utils';
import {useFormik} from 'formik';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {HelperText, TextInput} from 'react-native-paper';
import * as Yup from 'yup';

export const signUpvalidationSchema = (t: any) =>
  Yup.object({
    displayName: Yup.string()
      .required(t('validation.nameValidation'))
      .max(64, t('validation.max64Validation')),
    email: Yup.string()
      .required(t('validation.emailValidation'))
      .email(t('validation.emailFormatValidation'))
      .max(64, t('validation.max64Validation')),
    password: Yup.string()
      .required(t('validation.passwordValidation'))
      .min(6, t('validation.min6Validation'))
      .max(32, t('validation.max32Validation')),
    password_confirmation: Yup.string()
      .required(t('validation.confirmPasswordValidation'))
      .oneOf([Yup.ref('password')], t('validation.passwordsMatchValidation')),
  });

export const SignUpForm = ({onSubmit, initialValues, loading, error}: any) => {
  const {t} = useTranslation();

  const formik = useFormik({
    initialValues,
    validationSchema: signUpvalidationSchema(t),
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

  return (
    <>
      <AppText mb={20} variant="headlineMedium" fontWeight="bold">
        {t('titles.signUp')}
      </AppText>
      <Input
        leftIcon={<TextInput.Icon icon="email-outline" />}
        label={t('inputs.inputFirstNameLabel')}
        placeholder={t('inputs.inputFirstNamePlaceholder')}
        onChangeText={handleChange('displayName')}
        onBlur={handleBlur('displayName')}
        value={values.displayName}
        errorMessage={errors.displayName}
        touched={touched.displayName}
      />
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
        onChangeText={(value: string) => onChangeInput(value, 'password')}
        onBlur={handleBlur('password')}
        value={values.password}
        secureTextEntry
        showSecureEntryIcon
        errorMessage={errors.password}
        touched={touched.password}
      />
      <Input
        leftIcon={<TextInput.Icon icon="lock-open-outline" />}
        label={t('inputs.inputConfirmPasswordLabel')}
        placeholder={t('inputs.inputConfirmPasswordPlaceholder')}
        onChangeText={(value: string) =>
          onChangeInput(value, 'password_confirmation')
        }
        onBlur={handleBlur('password_confirmation')}
        value={values.password_confirmation}
        rightIcon={
          values.password_confirmation.length &&
          !errors.password_confirmation &&
          !errors.password && {
            type: 'ionicon',
            name: 'checkmark-circle',
            size: 25,
          }
        }
        secureTextEntry
        showSecureEntryIcon
        errorMessage={errors.password_confirmation}
        touched={touched.password_confirmation}
      />
      <AppButton
        mt={20}
        loading={loading}
        disabled={isContinueButtonDisabled || loading}
        onPress={handleSubmit}>
        {t('buttons.signUp')}
      </AppButton>
      {error ? (
        <HelperText type="error">
          {String(error?.message ? error.message : error)}
        </HelperText>
      ) : null}
    </>
  );
};
