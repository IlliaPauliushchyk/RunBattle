import {AppProviders} from '@/components';
import React from 'react';
import {RootNavigator} from './navigation';

export const App = () => {
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
};
