import {AppProviders} from '@/components';
import '@/lib/localization/i18n';
import React from 'react';
import {LogBox} from 'react-native';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';
import {RootNavigator} from './navigation';

LogBox.ignoreLogs([
  /\[@react-native-firebase\/firestore\]/,
  /deprecated API/,
  /migrating-to-v22/,
]);

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export const App = () => {
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
};
