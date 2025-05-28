import {AppText, Logo, ScreenContainer, SmsCodeTimer} from '@/components';
import {useSendEmailVerification} from '@/hooks';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';

const LOGO_SIZE = 140;

export const EmailVerificationScreen = () => {
  const {t} = useTranslation();
  const {mutateAsync} = useSendEmailVerification();

  useEffect(() => {
    sendEmailVerification();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendEmailVerification = () => {
    try {
      mutateAsync();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ScreenContainer>
      <Logo style={styles.logo} width={LOGO_SIZE} height={LOGO_SIZE} />
      <View style={styles.container}>
        <AppText
          variant="headlineMedium"
          fontWeight="bold"
          lineH={40}
          size={35}>
          {t('titles.emailVerification')}
        </AppText>
        <AppText mt={30} mb={30} lineH={24}>
          {t('text.emailVerificationDescription')}
        </AppText>

        <View>
          <SmsCodeTimer callback={mutateAsync} />
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  logo: {
    marginTop: 40,
    alignSelf: 'center',
  },
});
