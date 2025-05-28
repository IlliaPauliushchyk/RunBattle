import {AppButton, AppText, ScreenContainer} from '@/components';
import {Screens} from '@/constants';
import {defaultContainerStyle} from '@/styles';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {ImageBackground, StyleSheet} from 'react-native';
import {Card, useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export const WelcomeScreen = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const {t} = useTranslation();
  const {colors} = useTheme();

  const paddingBottom = insets.bottom + 20;
  const marginTop = -insets.top;
  const marginBottom = -insets.bottom;

  const goToSignUp = () => navigation.navigate(Screens.signUp);
  const goToSignIn = () => navigation.navigate(Screens.signIn);

  return (
    <ScreenContainer viewType="safeAreaView">
      <ImageBackground
        style={[styles.container, {marginTop, marginBottom, paddingBottom}]}
        source={require('@/assets/images/welcome_bg.jpg')}>
        <Card>
          <Card.Content style={styles.content}>
            <AppText
              mb={10}
              textAlign="center"
              fontWeight={'bold'}
              variant="headlineSmall">
              {t('titles.welcome')}
            </AppText>
            <AppText textAlign="center" mb={10} variant="bodyMedium">
              {t('text.welcome')}
            </AppText>
            <AppButton onPress={goToSignUp} mb={10}>
              {t('buttons.start')}
            </AppButton>
            <AppText textAlign="center" variant="bodyMedium">
              {t('text.hasAccount')}{' '}
              <AppText onPress={goToSignIn} color={colors.primary}>
                {t('text.logIn')}
              </AppText>
            </AppText>
          </Card.Content>
        </Card>
      </ImageBackground>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    ...defaultContainerStyle,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
  },
  content: {
    paddingHorizontal: 25,
  },
});
