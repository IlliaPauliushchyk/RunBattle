import {
  AppMapView,
  HomeMainContent,
  HomeRouteSettings,
  ScreenContainer,
} from '@/components';
import {useAppSelector} from '@/hooks';
import {selectUser} from '@/store';
import BottomSheet from '@gorhom/bottom-sheet';
import React, {useRef} from 'react';

export const HomeScreen = () => {
  const homeRef = useRef<BottomSheet>(null);
  const settingsRef = useRef<BottomSheet>(null);
  const {user} = useAppSelector(selectUser);

  const openSettings = () => {
    homeRef.current?.close();
    settingsRef.current?.expand();
  };

  const closeSettings = () => {
    homeRef.current?.expand();
    settingsRef.current?.close();
  };

  return (
    <ScreenContainer>
      <AppMapView />
      <HomeMainContent ref={homeRef} openSettings={openSettings} />
      <HomeRouteSettings ref={settingsRef} closeSettings={closeSettings} />
    </ScreenContainer>
  );
};
