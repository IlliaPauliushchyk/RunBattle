import {ScreenContainer} from '@/components';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';
import {Button, Divider, Menu, Text} from 'react-native-paper';

export const HomeScreen = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [routes, setRoutes] = useState([]); // Теперь храним несколько маршрутов
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [params, setParams] = useState({
    difficulty: 'medium',
    surface: 'any',
    routeCount: 3,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showRouteSelection, setShowRouteSelection] = useState(false);

  // Refs
  const mapRef = useRef(null);
  const flatListRef = useRef(null);

  // Меню
  const [difficultyMenuVisible, setDifficultyMenuVisible] = useState(false);
  const [surfaceMenuVisible, setSurfaceMenuVisible] = useState(false);
  const [countMenuVisible, setCountMenuVisible] = useState(false);

  // Параметры сложности
  const difficultySettings = {
    easy: {
      distance: 2,
      maxSlope: 0.05,
      maxElevationGain: 30,
    },
    medium: {
      distance: 5,
      maxSlope: 0.1,
      maxElevationGain: 100,
    },
    hard: {
      distance: 8,
      maxSlope: 0.2,
      maxElevationGain: 300,
    },
  };

  // Получение геопозиции
  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            getCurrentLocation();
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
      position => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      },
      error => setError(error.message),
      {enableHighAccuracy: true, timeout: 15000},
    );
  };

  // Генерация конечной точки
  const generateEndPoint = (start, difficulty, index) => {
    const {distance} = difficultySettings[difficulty];
    const R = 6371;

    // Добавляем вариативность на основе индекса маршрута
    const baseAngle = (index * (2 * Math.PI)) / params.routeCount; // Равномерное распределение
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
  const decodePolyline = encoded => {
    const poly = [];
    let index = 0,
      lat = 0,
      lng = 0;

    while (index < encoded.length) {
      let b,
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
  const getElevationData = async (points, difficulty) => {
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
    } catch (error) {
      console.error('Ошибка получения высот:', error);
      return generateFallbackElevations(points, difficulty);
    }
  };

  // Фильтрация точек по сложности
  const filterPointsByDifficulty = (points, {maxSlope, maxElevationGain}) => {
    if (points.length < 2) return points;

    const filtered = [points[0]];
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
        if (elevationDiff > 0) totalGain += elevationDiff;
      }
    }

    return filtered;
  };

  // Генерация тестовых данных о высотах
  const generateFallbackElevations = (points, difficulty) => {
    const {maxElevationGain} = difficultySettings[difficulty];
    return points.map((point, i) => ({
      ...point,
      elevation: 100 + (Math.sin(i * 0.1) * maxElevationGain) / 2,
    }));
  };

  // Расчет расстояния между точками
  const calculateDistance = (point1, point2) => {
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
  const generateRoutes = async () => {
    if (!currentLocation) {
      setError('Не удалось определить местоположение');
      return;
    }

    setLoading(true);
    setError(null);
    setRoutes([]);
    setSelectedRouteIndex(0);
    setShowRouteSelection(false);

    try {
      const generatedRoutes = [];

      for (let i = 0; i < params.routeCount; i++) {
        const endPoint = generateEndPoint(
          currentLocation,
          params.difficulty,
          i,
        ); // Передаем индекс

        const osrmResponse = await axios.get(
          `https://router.project-osrm.org/route/v1/foot/${currentLocation.longitude},${currentLocation.latitude};${endPoint.longitude},${endPoint.latitude}?overview=full&geometries=polyline`,
        );

        if (!osrmResponse.data.routes?.[0]?.geometry) {
          throw new Error('Не удалось построить маршрут');
        }

        const points = decodePolyline(osrmResponse.data.routes[0].geometry);
        const elevations = await getElevationData(points, params.difficulty);

        generatedRoutes.push({
          points,
          elevations,
          distance: difficultySettings[params.difficulty].distance,
          id: `route-${i}-${Date.now()}`,
        });
      }

      setRoutes(generatedRoutes);
      setShowRouteSelection(true);
    } catch (err) {
      console.error('Ошибка генерации маршрутов:', err);
      setError(err.message || 'Ошибка при построении маршрутов');
    } finally {
      setLoading(false);
    }
  };

  // Расчет параметров высот
  const getElevationStats = elevations => {
    if (!elevations || elevations.length < 2) return null;

    let totalAscent = 0;
    let totalDescent = 0;
    let maxElevation = -Infinity;
    let minElevation = Infinity;

    for (let i = 1; i < elevations.length; i++) {
      const diff = elevations[i].elevation - elevations[i - 1].elevation;
      if (diff > 0) totalAscent += diff;
      else totalDescent -= diff;

      maxElevation = Math.max(maxElevation, elevations[i].elevation);
      minElevation = Math.min(minElevation, elevations[i].elevation);
    }

    return {
      ascent: totalAscent.toFixed(0),
      descent: totalDescent.toFixed(0),
      maxDiff: (maxElevation - minElevation).toFixed(0),
    };
  };

  // Центрирование карты на выбранном маршруте
  const centerMapOnRoute = route => {
    if (!route.points.length || !mapRef.current) return;

    const coordinates = route.points;
    mapRef.current.fitToCoordinates(coordinates, {
      edgePadding: {top: 50, right: 50, bottom: 150, left: 50},
      animated: true,
    });
  };

  // Обработчик выбора маршрута в FlatList
  const handleRouteSelect = index => {
    setSelectedRouteIndex(index);
    centerMapOnRoute(routes[index]);

    // Прокручиваем FlatList к выбранному элементу
    flatListRef.current?.scrollToIndex({index, animated: true});
  };

  // Возврат к настройкам
  const returnToSettings = () => {
    setShowRouteSelection(false);
    setRoutes([]);
  };

  return (
    <ScreenContainer logo style={styles.container} title="Run Battle">
      {currentLocation ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={currentLocation}
          showsUserLocation={true}
          followsUserLocation={true}>
          {routes.length > 0 && routes[selectedRouteIndex] && (
            <>
              <Polyline
                coordinates={routes[selectedRouteIndex].points}
                strokeColor="#FF6B35"
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
        </MapView>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text>Определение местоположения...</Text>
        </View>
      )}

      {!showRouteSelection ? (
        <View style={styles.controls}>
          <View style={styles.paramRow}>
            {/* Меню выбора сложности */}
            <Menu
              visible={difficultyMenuVisible}
              onDismiss={() => setDifficultyMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setDifficultyMenuVisible(true)}
                  style={styles.menuButton}
                  contentStyle={styles.menuButtonContent}>
                  {params.difficulty === 'easy'
                    ? 'Легко'
                    : params.difficulty === 'medium'
                    ? 'Средне'
                    : 'Сложно'}
                </Button>
              }>
              <Menu.Item
                onPress={() => {
                  setParams({...params, difficulty: 'easy'});
                  setDifficultyMenuVisible(false);
                }}
                title="Легко (2 км, малые перепады)"
              />
              <Menu.Item
                onPress={() => {
                  setParams({...params, difficulty: 'medium'});
                  setDifficultyMenuVisible(false);
                }}
                title="Средне (5 км, умеренные перепады)"
              />
              <Menu.Item
                onPress={() => {
                  setParams({...params, difficulty: 'hard'});
                  setDifficultyMenuVisible(false);
                }}
                title="Сложно (8 км, значительные перепады)"
              />
            </Menu>

            {/* Меню выбора поверхности */}
            <Menu
              visible={surfaceMenuVisible}
              onDismiss={() => setSurfaceMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setSurfaceMenuVisible(true)}
                  style={styles.menuButton}
                  contentStyle={styles.menuButtonContent}>
                  {params.surface === 'any'
                    ? 'Любое'
                    : params.surface === 'asphalt'
                    ? 'Асфальт'
                    : 'Грунт'}
                </Button>
              }>
              <Menu.Item
                onPress={() => {
                  setParams({...params, surface: 'any'});
                  setSurfaceMenuVisible(false);
                }}
                title="Любое покрытие"
              />
              <Menu.Item
                onPress={() => {
                  setParams({...params, surface: 'asphalt'});
                  setSurfaceMenuVisible(false);
                }}
                title="Асфальт"
              />
              <Menu.Item
                onPress={() => {
                  setParams({...params, surface: 'dirt'});
                  setSurfaceMenuVisible(false);
                }}
                title="Грунт"
              />
            </Menu>
          </View>

          <View style={styles.paramRow}>
            {/* Меню выбора количества маршрутов */}
            <Menu
              visible={countMenuVisible}
              onDismiss={() => setCountMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setCountMenuVisible(true)}
                  style={styles.menuButton}
                  contentStyle={styles.menuButtonContent}>
                  {params.routeCount} варианта
                </Button>
              }>
              {[1, 2, 3, 5].map(count => (
                <Menu.Item
                  key={count}
                  onPress={() => {
                    setParams({...params, routeCount: count});
                    setCountMenuVisible(false);
                  }}
                  title={`${count} вариант${count > 1 ? 'а' : ''}`}
                />
              ))}
            </Menu>
          </View>

          <Divider style={styles.divider} />

          <Button
            mode="contained"
            onPress={generateRoutes}
            loading={loading}
            disabled={loading}
            style={styles.generateButton}
            labelStyle={styles.generateButtonLabel}>
            Сгенерировать маршруты
          </Button>

          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      ) : (
        <View style={styles.routeSelectionContainer}>
          <FlatList
            ref={flatListRef}
            horizontal
            data={routes}
            keyExtractor={item => item.id}
            renderItem={({item, index}) => {
              const stats = getElevationStats(item.elevations);
              return (
                <TouchableOpacity
                  style={[
                    styles.routeCard,
                    index === selectedRouteIndex && styles.selectedRouteCard,
                  ]}
                  onPress={() => handleRouteSelect(index)}>
                  <Text style={styles.routeTitle}>Маршрут {index + 1}</Text>
                  <Text style={styles.routeText}>
                    Дистанция: {item.distance} км
                  </Text>
                  {stats && (
                    <>
                      <Text style={styles.routeText}>
                        Подъем: {stats.ascent} м
                      </Text>
                      <Text style={styles.routeText}>
                        Спуск: {stats.descent} м
                      </Text>
                      <Text style={styles.routeText}>
                        Макс. перепад: {stats.maxDiff} м
                      </Text>
                    </>
                  )}
                  <Button
                    mode="contained"
                    style={styles.selectButton}
                    onPress={() =>
                      Alert.alert(
                        'Маршрут выбран',
                        `Выбран маршрут ${index + 1}`,
                      )
                    }>
                    Выбрать
                  </Button>
                </TouchableOpacity>
              );
            }}
            snapToInterval={300} // Ширина карточки + margin
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.flatListContent}
          />

          <Button
            mode="outlined"
            onPress={returnToSettings}
            style={styles.backButton}
            labelStyle={styles.backButtonLabel}>
            Назад к настройкам
          </Button>
        </View>
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  routeSelectionContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    paddingBottom: 80,
  },
  paramRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  menuButton: {
    flex: 1,
    marginHorizontal: 4,
    borderColor: '#6200ee',
    height: 40,
  },
  menuButtonContent: {
    height: 40,
    justifyContent: 'center',
  },
  divider: {
    marginVertical: 8,
    backgroundColor: '#e0e0e0',
    height: 1,
  },
  generateButton: {
    backgroundColor: '#6200ee',
    borderRadius: 8,
    paddingVertical: 6,
  },
  generateButtonLabel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  flatListContent: {
    paddingHorizontal: 16,
  },
  routeCard: {
    width: 280,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginRight: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  selectedRouteCard: {
    borderColor: '#6200ee',
    borderWidth: 2,
  },
  routeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  routeText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  selectButton: {
    marginTop: 12,
    backgroundColor: '#6200ee',
  },
  backButton: {
    marginTop: 16,
    marginHorizontal: 16,
    borderColor: '#6200ee',
  },
  backButtonLabel: {
    color: '#6200ee',
  },
  errorText: {
    color: '#d32f2f',
    marginTop: 8,
    textAlign: 'center',
    fontSize: 14,
  },
});
