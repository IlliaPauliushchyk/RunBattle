import {Spinner} from '@/components';
import {useGetInitialLanguage, useGetUser} from '@/hooks';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ApplicationStackNavigator} from './ApplicationStackNavigator';
import {AuthenticationStackNavigator} from './AuthenticationStackNavigator';

export const RootNavigator = () => {
  // const { navigationRef, onReady, onStateChange } = useGetNavigationAnalyticsData()
  const {loading, isWaitForVerification, initializing, isLoggedIn} =
    useGetUser();
  useGetInitialLanguage();

  if (loading || initializing) {
    return <Spinner />;
  }

  return (
    <SafeAreaProvider>
      {isLoggedIn ? (
        <ApplicationStackNavigator
          isWaitForVerification={isWaitForVerification}
        />
      ) : (
        <AuthenticationStackNavigator />
      )}
    </SafeAreaProvider>
  );
};
