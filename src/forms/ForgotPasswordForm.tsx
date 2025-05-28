import {AppButton, Input} from '@/components';
import {isErrorsExist} from '@/utils';
import {useFormik} from 'formik';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet} from 'react-native';
import {HelperText, TextInput} from 'react-native-paper';
import * as Yup from 'yup';

export const validationSchema = (t: any) =>
  Yup.object({
    email: Yup.string()
      .required(t('validation.emailValidation'))
      .email(t('validation.emailFormatValidation'))
      .max(64, t('validation.max64Validation')),
  });

export const ForgotPasswordForm = ({
  onSubmit,
  initialValues,
  loading,
  error,
}: any) => {
  const {t} = useTranslation();
  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema(t),
    onSubmit,
  });

  const {
    values,
    touched,
    errors,
    handleSubmit,
    handleChange,
    handleBlur,
    resetForm,
  } = formik;

  useEffect(() => {
    return () => {
      resetForm();
    };
  }, [resetForm]);

  const isContinueButtonDisabled = isErrorsExist(errors);

  return (
    <>
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
      <AppButton
        mode="contained"
        disabled={isContinueButtonDisabled || loading}
        style={styles.button}
        loading={loading}
        onPress={handleSubmit}>
        {t('buttons.send')}
      </AppButton>
      {error ? <HelperText type="error">{error}</HelperText> : null}
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-end',
  },
});
