import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AuthenticationStackNavigator} from './AuthenticationStackNavigator';

export const RootNavigator = () => {
  // const { navigationRef, onReady, onStateChange } = useGetNavigationAnalyticsData()
  // const { loading, initializing, isLoggedIn } = useGetUser()
  // useGetInitialLanguage()

  // if (loading || initializing) {
  //   return <Spinner backgroundColor={theme.colors.background} />
  // }

  return (
    <SafeAreaProvider>
      <AuthenticationStackNavigator />
    </SafeAreaProvider>
  );
};
