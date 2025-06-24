/* eslint-disable no-bitwise */
import {selectUser} from '@/store';
import axios from 'axios';
import {useState} from 'react';
import {useAppSelector} from './redux';
import {useGetLocation} from './useGetLocation';

// Типы для настроек сложности
type DifficultySettings = {
  [key: string]: {
    distance: number;
    maxSlope: number;
    maxElevationGain: number;
  };
};

// Тип для точки маршрута
interface RoutePoint {
  latitude: number;
  longitude: number;
  elevation?: number;
}

// Тип для данных о высоте
interface ElevationData {
  latitude: number;
  longitude: number;
  elevation: number;
}

// Тип для сгенерированного маршрута
export interface GeneratedRoute {
  points: RoutePoint[];
  elevations: ElevationData[];
  distance: number;
  id: string;
}

export const useGenerateRoutes = () => {
  const {currentLocation} = useGetLocation();
  const {settings: params} = useAppSelector(selectUser);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [routes, setRoutes] = useState<GeneratedRoute[]>([]);
  const [showRouteSelection, setShowRouteSelection] = useState<boolean>(false);

  // Настройки сложности
  const difficultySettings: DifficultySettings = {
    easy: {
      distance: 3,
      maxSlope: 0.1,
      maxElevationGain: 100,
    },
    medium: {
      distance: 5,
      maxSlope: 0.15,
      maxElevationGain: 200,
    },
    hard: {
      distance: 8,
      maxSlope: 0.2,
      maxElevationGain: 300,
    },
  };

  // Генерация конечной точки
  const generateEndPoint = (
    start: RoutePoint,
    difficulty: string,
    index: number,
  ): RoutePoint => {
    const {distance} = difficultySettings[difficulty];
    const R = 6371;

    // Добавляем вариативность на основе индекса маршрута
    const baseAngle = (index * (2 * Math.PI)) / params!.routeCount; // Равномерное распределение
    const randomVariation = (Math.random() - 0.5) * 0.5; // Добавляем небольшую случайность
    const bearing = baseAngle + randomVariation;

    const lat1 = (start.latitude * Math.PI) / 180;
    const lon1 = (start.longitude * Math.PI) / 180;

    const lat2 = Math.asin(
      Math.sin(lat1) * Math.cos(distance / R) +
        Math.cos(lat1) * Math.sin(distance / R) * Math.cos(bearing),
    );

    const lon2 =
      lon1 +
      Math.atan2(
        Math.sin(bearing) * Math.sin(distance / R) * Math.cos(lat1),
        Math.cos(distance / R) - Math.sin(lat1) * Math.sin(lat2),
      );

    return {
      latitude: (lat2 * 180) / Math.PI,
      longitude: (lon2 * 180) / Math.PI,
    };
  };

  // Декодирование полилинии
  const decodePolyline = (encoded: string): RoutePoint[] => {
    const poly: RoutePoint[] = [];
    let index = 0,
      lat = 0,
      lng = 0;

    while (index < encoded.length) {
      let b: number,
        shift = 0,
        result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      lat += result & 1 ? ~(result >> 1) : result >> 1;

      shift = result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      lng += result & 1 ? ~(result >> 1) : result >> 1;

      poly.push({latitude: lat / 1e5, longitude: lng / 1e5});
    }

    return poly;
  };

  // Получение данных о высотах
  const getElevationData = async (
    points: RoutePoint[],
    difficulty: string,
  ): Promise<ElevationData[]> => {
    try {
      const sampleStep = Math.max(1, Math.floor(points.length / 50));
      const sampledPoints = points.filter((_, i) => i % sampleStep === 0);

      const locations = sampledPoints
        .map(p => `${p.latitude},${p.longitude}`)
        .join('|');
      const response = await axios.get(
        `https://api.open-elevation.com/api/v1/lookup?locations=${locations}`,
      );

      return filterPointsByDifficulty(
        response.data.results || [],
        difficultySettings[difficulty],
      );
    } catch (e) {
      console.error('Ошибка получения высот:', e);
      return generateFallbackElevations(points, difficulty);
    }
  };

  // Фильтрация точек по сложности
  const filterPointsByDifficulty = (
    points: ElevationData[],
    {maxSlope, maxElevationGain}: {maxSlope: number; maxElevationGain: number},
  ): ElevationData[] => {
    if (points.length < 2) {
      return points;
    }

    const filtered: ElevationData[] = [points[0]];
    let totalGain = 0;

    for (let i = 1; i < points.length; i++) {
      const distance = calculateDistance(
        filtered[filtered.length - 1],
        points[i],
      );
      const elevationDiff =
        points[i].elevation - filtered[filtered.length - 1].elevation;
      const slope = elevationDiff / distance;

      if (
        Math.abs(slope) <= maxSlope &&
        (elevationDiff <= 0 || totalGain + elevationDiff <= maxElevationGain)
      ) {
        filtered.push(points[i]);
        if (elevationDiff > 0) {
          totalGain += elevationDiff;
        }
      }
    }

    return filtered;
  };

  // Генерация тестовых данных о высотах
  const generateFallbackElevations = (
    points: RoutePoint[],
    difficulty: string,
  ): ElevationData[] => {
    const {maxElevationGain} = difficultySettings[difficulty];
    return points.map((point, i) => ({
      ...point,
      elevation: 100 + (Math.sin(i * 0.1) * maxElevationGain) / 2,
    }));
  };

  // Расчет расстояния между точками
  const calculateDistance = (
    point1: RoutePoint,
    point2: RoutePoint,
  ): number => {
    const R = 6371e3;
    const φ1 = (point1.latitude * Math.PI) / 180;
    const φ2 = (point2.latitude * Math.PI) / 180;
    const Δφ = ((point2.latitude - point1.latitude) * Math.PI) / 180;
    const Δλ = ((point2.longitude - point1.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // Генерация нескольких маршрутов
  const generateRoutes = async (): Promise<void> => {
    if (!currentLocation) {
      setError('Не удалось определить местоположение');
      return;
    }

    setLoading(true);
    setError(null);
    setRoutes([]);

    try {
      const generatedRoutes: GeneratedRoute[] = [];

      for (let i = 0; i < params!.routeCount; i++) {
        const endPoint = generateEndPoint(
          currentLocation,
          params!.difficulty,
          i,
        );

        const osrmResponse = await axios.get(
          `https://router.project-osrm.org/route/v1/foot/${currentLocation.longitude},${currentLocation.latitude};${endPoint.longitude},${endPoint.latitude}?overview=full&geometries=polyline`,
        );

        if (!osrmResponse.data.routes?.[0]?.geometry) {
          throw new Error('Не удалось построить маршрут');
        }

        const points = decodePolyline(osrmResponse.data.routes[0].geometry);
        const elevations = await getElevationData(points, params!.difficulty);

        generatedRoutes.push({
          points,
          elevations,
          distance: difficultySettings[params!.difficulty].distance,
          id: `route-${i}-${Date.now()}`,
        });
      }

      setRoutes(generatedRoutes);
      setShowRouteSelection(true);
    } catch (err) {
      console.error('Ошибка генерации маршрутов:', err);
      setError((err as Error).message || 'Ошибка при построении маршрутов');
    } finally {
      setLoading(false);
    }
  };

  return {generateRoutes, routes, loading, error, showRouteSelection};
};
