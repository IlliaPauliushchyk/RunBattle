import {AppButton, AppText, ScreenContainer} from '@/components';
import {Screens} from '@/constants';
import {defaultContainerStyle} from '@/styles';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {ImageBackground, StyleSheet} from 'react-native';
import {Card, useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export const WelcomeScreen = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const {colors} = useTheme();

  const paddingBottom = insets.bottom + 20;

  const goToSignUp = () => navigation.navigate(Screens.signUp);
  const goToSignIn = () => navigation.navigate(Screens.signIn);

  return (
    <ScreenContainer>
      <ImageBackground
        style={[styles.container, {paddingBottom}]}
        source={require('@/assets/images/welcome_bg.jpg')}>
        <Card>
          <Card.Content style={styles.content}>
            <AppText mb={10} textAlign="center" variant="headlineMedium">
              Преврати каждый забег в приключение!
            </AppText>
            <AppText textAlign="center" mb={10} variant="bodyMedium">
              Создавай уникальные маршруты, соревнуйся с друзьями и покоряй топы
              лидеров. Беги, зарабатывай достижения и становись королём
              городских троп!
            </AppText>
            <AppButton onPress={goToSignUp} mb={10}>
              Начать
            </AppButton>
            <AppText textAlign="center" variant="bodyMedium">
              Уже есть аккаунт?{' '}
              <AppText onPress={goToSignIn} color={colors.primary}>
                Логин
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
    paddingHorizontal: 40,
  },
});
