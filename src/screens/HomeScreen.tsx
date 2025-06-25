import {
  AppMapView,
  HomeMainContent,
  HomeRouteSettings,
  HomeRoutesList,
  ScreenContainer,
} from '@/components';
import {useGenerateRoutes, useGetLocation} from '@/hooks';
import BottomSheet from '@gorhom/bottom-sheet';
import React, {useRef} from 'react';
import {Marker, Polyline} from 'react-native-maps';
import {useTheme} from 'react-native-paper';

export const HomeScreen = () => {
  const {colors} = useTheme();
  const {currentLocation} = useGetLocation();
  const {
    generateRoutes,
    getElevationStats,
    centerMapOnRoute,
    setSelectedRouteIndex,
    setRoutes,
    selectedRouteIndex,
    mapRef,
    routes,
    loading,
  } = useGenerateRoutes();

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

  const closeRoutes = () => {
    setRoutes([]);
    homeRef.current?.expand();
    settingsRef.current?.close();
  };

  return (
    <ScreenContainer>
      <AppMapView ref={mapRef}>
        {routes.length > 0 && routes[selectedRouteIndex] && (
          <>
            <Polyline
              coordinates={routes[selectedRouteIndex].points}
              strokeColor={colors.primary}
              strokeWidth={4}
            />
            <Marker
              coordinate={routes[selectedRouteIndex].points[0]}
              title="Старт"
              pinColor="green"
            />
            <Marker
              coordinate={
                routes[selectedRouteIndex].points[
                  routes[selectedRouteIndex].points.length - 1
                ]
              }
              title="Финиш"
              pinColor="red"
            />
          </>
        )}
      </AppMapView>
      <HomeMainContent
        ref={homeRef}
        openSettings={openSettings}
        generateRoutes={generateRoutes}
        closeMenu={closeMenu}
        loading={loading || !currentLocation}
      />
      <HomeRouteSettings ref={settingsRef} closeSettings={closeSettings} />
      <HomeRoutesList
        routes={routes}
        selectedRouteIndex={selectedRouteIndex}
        getElevationStats={getElevationStats}
        centerMapOnRoute={centerMapOnRoute}
        setSelectedRouteIndex={setSelectedRouteIndex}
        closeRoutes={closeRoutes}
      />
    </ScreenContainer>
  );
};
