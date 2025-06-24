import {
  AppMapView,
  HomeMainContent,
  HomeRouteSettings,
  ScreenContainer,
} from '@/components';
import {useGenerateRoutes} from '@/hooks';
import BottomSheet from '@gorhom/bottom-sheet';
import React, {useRef} from 'react';

export const HomeScreen = () => {
  const {generateRoutes, routes, loading} = useGenerateRoutes();
  console.log(routes);
  const homeRef = useRef<BottomSheet>(null);
  const settingsRef = useRef<BottomSheet>(null);

  const openSettings = () => {
    homeRef.current?.close();
    settingsRef.current?.expand();
  };

  const closeSettings = () => {
    homeRef.current?.expand();
    settingsRef.current?.close();
  };

  const closeMenu = () => {
    homeRef.current?.close();
    settingsRef.current?.close();
  };

  return (
    <ScreenContainer>
      <AppMapView />
      <HomeMainContent
        ref={homeRef}
        openSettings={openSettings}
        generateRoutes={generateRoutes}
        closeMenu={closeMenu}
        loading={loading}
      />
      <HomeRouteSettings ref={settingsRef} closeSettings={closeSettings} />
    </ScreenContainer>
  );
};
