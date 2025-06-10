import {useGetLocation} from '@/hooks';
import {defaultContainerStyle} from '@/styles';
import React, {forwardRef, ReactNode} from 'react';
import MapView, {MapViewProps} from 'react-native-maps';
import {Spinner} from './Spinner';

type AppMapViewProps = {
  children?: ReactNode;
} & Omit<MapViewProps, 'ref'>;

export const AppMapView = forwardRef<MapView, AppMapViewProps>(
  ({children, ...restProps}, ref) => {
    const {currentLocation} = useGetLocation();

    if (!currentLocation) {
      return <Spinner />;
    }

    return (
      <MapView
        ref={ref}
        style={defaultContainerStyle}
        initialRegion={currentLocation}
        showsUserLocation={true}
        followsUserLocation={true}
        {...restProps}>
        {children}
      </MapView>
    );
  },
);
