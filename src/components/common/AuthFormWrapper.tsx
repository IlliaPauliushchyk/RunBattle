import {Screens} from '@/constants';
import {useNavigation} from '@react-navigation/native';
import React, {ReactNode} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import KeyboardDismissView from 'react-native-keyboard-dismiss-view';
import {useTheme} from 'react-native-paper';
import {AppText} from './AppText';
import {Logo} from './Logo';
import {ScreenContainer} from './ScreenContainer';

const LOGO_SIZE = 140;

interface AuthFormWrapperProps {
  children: ReactNode;
  type: 'signUp' | 'signIn';
}

export const AuthFormWrapper = ({children, type}: AuthFormWrapperProps) => {
  const navigation = useNavigation<any>();

  const {t} = useTranslation();
  const {colors} = useTheme();

  const bottomText =
    type === 'signIn' ? t('text.noAccount') : t('text.hasAccount');
  const bottomButton = type === 'signIn' ? t('text.signUp') : t('text.logIn');

  const goToSignUp = () => navigation.navigate(Screens.signUp);
  const goToSignIn = () => navigation.navigate(Screens.signIn);

  const goToScreen = () => {
    if (type === 'signIn') {
      goToSignUp();
    } else {
      goToSignIn();
    }
  };

  return (
    <ScreenContainer
    //   viewType={Platform.OS === 'ios' ? 'safeAreaView' : undefined}
    >
      <KeyboardDismissView style={styles.container}>
        <Logo style={styles.logo} width={LOGO_SIZE} height={LOGO_SIZE} />
        <View>{children}</View>
        <View>
          <AppText textAlign="center" variant="bodyLarge">
            {bottomText}{' '}
            <AppText onPress={goToScreen} color={colors.primary}>
              {bottomButton}
            </AppText>
          </AppText>
        </View>
      </KeyboardDismissView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    justifyContent: 'space-between',
  },
  logo: {
    alignSelf: 'center',
  },
});
