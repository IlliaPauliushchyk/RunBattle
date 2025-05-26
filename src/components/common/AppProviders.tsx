import {getTheme} from '@/utils';
import {NavigationContainer} from '@react-navigation/native';
import React, {ReactNode} from 'react';
import {PaperProvider} from 'react-native-paper';

type Props = {
  children: ReactNode;
};

export const AppProviders = ({children}: Props) => {
  return (
    <PaperProvider theme={getTheme()}>
      <NavigationContainer theme={getTheme()}>{children}</NavigationContainer>
    </PaperProvider>
  );
};
