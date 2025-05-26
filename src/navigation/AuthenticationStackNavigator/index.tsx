import {Screens} from '@/constants';
import {WelcomeScreen} from '@/screens';
import {noHeaderScreenOptions} from '@/styles';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

const Stack = createNativeStackNavigator();

export const AuthenticationStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={noHeaderScreenOptions}>
      <Stack.Screen name={Screens.welcome} component={WelcomeScreen} />
    </Stack.Navigator>
  );
};
