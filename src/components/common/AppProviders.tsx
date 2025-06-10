import {queryClient} from '@/lib';
import {store} from '@/store';
import {defaultContainerStyle} from '@/styles';
import {getTheme} from '@/utils';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {NavigationContainer} from '@react-navigation/native';
import {QueryClientProvider} from '@tanstack/react-query';
import React, {ReactNode} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
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
            <GestureHandlerRootView style={defaultContainerStyle}>
              <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
            </GestureHandlerRootView>
          </NavigationContainer>
        </PaperProvider>
      </QueryClientProvider>
    </Provider>
  );
};
