import {AppProviders} from '@/components';
import '@/lib/localization/i18n';
import React from 'react';
import {LogBox} from 'react-native';
import {RootNavigator} from './navigation';

LogBox.ignoreLogs([
  /\[@react-native-firebase\/firestore\]/,
  /deprecated API/,
  /migrating-to-v22/,
]);

export const App = () => {
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
};
