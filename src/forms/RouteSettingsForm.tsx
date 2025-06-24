import {AppButton, AppText, Picker} from '@/components';
import {getRouteDifficulty, getRouteSurface} from '@/mocks';
import {defaultRowStyle} from '@/styles';
import {isErrorsExist} from '@/utils';
import {useFormik} from 'formik';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {HelperText, IconButton, useTheme} from 'react-native-paper';

export const RouteSettingsForm = ({
  onSubmit,
  initialValues,
  loading,
  error,
  closeSettings,
}: any) => {
  const {t} = useTranslation();
  const {colors} = useTheme();

  const formik = useFormik({
    initialValues,
    onSubmit,
  });

  const {values, errors, handleSubmit, setFieldValue, resetForm} = formik;

  useEffect(() => {
    return () => {
      resetForm();
    };
  }, [resetForm]);

  const increaseRouteCount = () => {
    const increasedValue = values.routeCount + 1;
    const newValue = increasedValue > 3 ? 3 : increasedValue;
    setFieldValue('routeCount', newValue);
  };

  const decreaseRouteCount = () => {
    const decreasedValue = values.routeCount - 1;
    const newValue = decreasedValue < 1 ? 1 : decreasedValue;
    setFieldValue('routeCount', newValue);
  };

  const isContinueButtonDisabled = isErrorsExist(errors);

  return (
    <>
      <AppText variant="bodySmall" color={colors.onSurfaceVariant}>
        {t('inputs.inputRouteCountLabel')}
      </AppText>
      <View style={[defaultRowStyle, styles.countButtons]}>
        <IconButton
          disabled={values.routeCount === 1}
          size={12}
          style={styles.iconButtons}
          icon={'minus'}
          mode="contained"
          onPress={decreaseRouteCount}
        />
        <AppText variant="titleLarge" mh={20}>
          {values.routeCount}
        </AppText>
        <IconButton
          disabled={values.routeCount === 3}
          size={12}
          style={styles.iconButtons}
          icon={'plus'}
          mode="contained"
          onPress={increaseRouteCount}
        />
      </View>

      <Picker
        label={t('inputs.inputDifficultyLabel')}
        items={getRouteDifficulty(t)}
        value={values.difficulty}
        onSelectItem={item => setFieldValue('difficulty', item.value)}
      />
      <Picker
        label={t('inputs.inputSurfaceLabel')}
        items={getRouteSurface(t)}
        value={values.surface}
        onSelectItem={item => setFieldValue('surface', item.value)}
      />
      <AppButton
        mt={12}
        mb={10}
        loading={loading}
        disabled={isContinueButtonDisabled || loading}
        onPress={handleSubmit}>
        {t('buttons.save')}
      </AppButton>
      <AppButton mb={20} mode={'outlined'} onPress={closeSettings}>
        {t('buttons.back')}
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
  iconButtons: {
    marginHorizontal: 0,
  },
  countButtons: {
    marginBottom: 18,
  },
});
