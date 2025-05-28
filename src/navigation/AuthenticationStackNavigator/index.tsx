import {Screens} from '@/constants';
import {
  ForgotPasswordScreen,
  SignInScreen,
  SignUpScreen,
  WelcomeScreen,
} from '@/screens';
import {noHeaderScreenOptions} from '@/styles';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

const Stack = createNativeStackNavigator();

export const AuthenticationStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={noHeaderScreenOptions}>
      <Stack.Screen name={Screens.welcome} component={WelcomeScreen} />
      <Stack.Screen name={Screens.signUp} component={SignUpScreen} />
      <Stack.Screen name={Screens.signIn} component={SignInScreen} />
      <Stack.Screen
        name={Screens.forgotPassword}
        component={ForgotPasswordScreen}
      />
    </Stack.Navigator>
  );
};
