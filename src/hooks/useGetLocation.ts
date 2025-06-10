import Geolocation, {
  GeolocationError,
  GeolocationResponse,
} from '@react-native-community/geolocation';
import {useEffect, useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {Region} from 'react-native-maps';

type UseGetLocationResult = {
  currentLocation: Region | null;
  error: string | null;
};

export const useGetLocation = (): UseGetLocationResult => {
  const [currentLocation, setCurrentLocation] = useState<Region | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            getCurrentLocation();
          } else {
            setError('Разрешение на геолокацию отклонено');
          }
        } catch (err) {
          setError('Ошибка разрешения геолокации');
        }
      } else {
        getCurrentLocation();
      }
    };

    requestLocationPermission();
  }, []);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position: GeolocationResponse) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      },
      (e: GeolocationError) => setError(e.message),
      {enableHighAccuracy: true, timeout: 15000},
    );
  };

  return {currentLocation, error};
};
