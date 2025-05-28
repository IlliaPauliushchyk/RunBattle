import {AppText, Logo, ScreenContainer} from '@/components';
import {useSendPasswordResetEmail} from '@/hooks';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import KeyboardDismissView from 'react-native-keyboard-dismiss-view';
import {ForgotPasswordForm} from '../forms/ForgotPasswordForm';

const LOGO_SIZE = 140;

export interface IForgotPasswordValues {
  email: string;
}

export const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const {
    mutateAsync: sendPasswordResetEmail,
    isPending,
    error,
  } = useSendPasswordResetEmail();

  const initialValues = {email: ''} as IForgotPasswordValues;

  const handleSubmit = async (values: IForgotPasswordValues): Promise<void> => {
    try {
      const {email} = values;

      await sendPasswordResetEmail({email});

      navigation.goBack();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ScreenContainer navigation={navigation} title={' '}>
      <Logo style={styles.logo} width={LOGO_SIZE} height={LOGO_SIZE} />
      <KeyboardDismissView style={styles.container}>
        <AppText
          variant="headlineMedium"
          fontWeight="bold"
          lineH={40}
          size={35}>
          {t('titles.forgotPassword')}
        </AppText>
        <AppText mt={30} mb={30} lineH={24}>
          {t('text.forgotPassword')}
        </AppText>

        <View>
          <ForgotPasswordForm
            onSubmit={handleSubmit}
            initialValues={initialValues}
            loading={isPending}
            error={error}
          />
        </View>
      </KeyboardDismissView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  logo: {
    marginTop: 20,
    alignSelf: 'center',
  },
});
