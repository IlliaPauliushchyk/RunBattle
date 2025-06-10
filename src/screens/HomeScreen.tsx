import {
  AppMapView,
  AppText,
  AutoHeightBottomSheet,
  ScreenContainer,
} from '@/components';
import React from 'react';

export const HomeScreen = () => {
  return (
    <ScreenContainer>
      <AppMapView />
      <AutoHeightBottomSheet>
        <AppText mb={20}>Hello</AppText>
      </AutoHeightBottomSheet>
    </ScreenContainer>
  );
};
