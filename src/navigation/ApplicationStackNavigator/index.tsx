import {Screens} from '@/constants';
import {EmailVerificationScreen, HomeScreen} from '@/screens';
import {noHeaderScreenOptions} from '@/styles';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

const Stack = createNativeStackNavigator();

interface Props {
  isWaitForVerification: boolean;
}

export const ApplicationStackNavigator = ({isWaitForVerification}: Props) => {
  return (
    <Stack.Navigator screenOptions={noHeaderScreenOptions}>
      {isWaitForVerification && (
        <Stack.Screen
          name={Screens.emailVerification}
          component={EmailVerificationScreen}
        />
      )}
      <Stack.Screen name={Screens.home} component={HomeScreen} />
    </Stack.Navigator>
  );
};
