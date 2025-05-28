import {queryClient} from '@/lib';
import {store} from '@/store';
import {getTheme} from '@/utils';
import {NavigationContainer} from '@react-navigation/native';
import {QueryClientProvider} from '@tanstack/react-query';
import React, {ReactNode} from 'react';
import {PaperProvider} from 'react-native-paper';
import {Provider} from 'react-redux';

type Props = {
  children: ReactNode;
};

export const AppProviders = ({children}: Props) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <PaperProvider theme={getTheme()}>
          <NavigationContainer theme={getTheme()}>
            {children}
          </NavigationContainer>
        </PaperProvider>
      </QueryClientProvider>
    </Provider>
  );
};
