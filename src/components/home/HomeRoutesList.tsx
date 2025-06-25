import {ElevationPoint, ElevationStats, GeneratedRoute} from '@/hooks';
import {defaultNoMaarginStyle} from '@/styles';
import React, {Dispatch, SetStateAction, useEffect, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert, Dimensions, FlatList, StyleSheet, View} from 'react-native';
import {Card, IconButton, useTheme} from 'react-native-paper';
import {AppButton} from '../common/AppButton';
import {AppText} from '../common/AppText';
import {ElevationChart} from './ElevationsChart';

type Props = {
  routes: GeneratedRoute[];
  selectedRouteIndex: number;
  getElevationStats: (
    elevations: ElevationPoint[] | null | undefined,
  ) => ElevationStats | null;
  centerMapOnRoute: (route: GeneratedRoute) => void;
  setSelectedRouteIndex: Dispatch<SetStateAction<number>>;
  closeRoutes: () => void;
};

const CARD_WIDTH = Dimensions.get('window').width * 0.8;
const SNAP_INTERVAL = CARD_WIDTH + 16;
const CHART_WIDTH = CARD_WIDTH - 32;
const CHART_HEIGHT = CHART_WIDTH * 0.4;

export const HomeRoutesList = ({
  routes,
  selectedRouteIndex,
  setSelectedRouteIndex,
  getElevationStats,
  centerMapOnRoute,
  closeRoutes,
}: Props) => {
  const {t} = useTranslation();
  const {colors} = useTheme();

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (routes?.length > 0 && selectedRouteIndex === 0) {
      handleRouteSelect(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routes]);

  const handleRouteSelect = (index: number) => {
    setSelectedRouteIndex(index);
    centerMapOnRoute(routes[index]);
  };

  const handleScroll = (event: any) => {
    const {contentOffset} = event.nativeEvent;
    const index = Math.round(contentOffset.x / SNAP_INTERVAL);
    if (index >= 0 && index < routes.length && index !== selectedRouteIndex) {
      handleRouteSelect(index);
    }
  };

  const renderItem = ({item, index}: {item: GeneratedRoute; index: number}) => {
    const stats = getElevationStats(item.elevations);

    return (
      <Card style={styles.item} onPress={() => handleRouteSelect(index)}>
        <Card.Content>
          <AppText variant="titleLarge" fontWeight="bold">
            {t('text.route')} {index + 1}
          </AppText>
          <AppText variant="bodyMedium" mb={8} color={colors.onSurfaceVariant}>
            {item.distance} {t('text.km')}, {t('text.drop')}: {stats?.maxDiff}{' '}
            {t('text.m')}
          </AppText>
          <ElevationChart
            width={CHART_WIDTH}
            height={CHART_HEIGHT}
            elevations={item.elevations}
            distance={item.distance * 1000}
            totalAscent={Number(stats?.ascent)}
            totalDescent={Number(stats?.descent)}
          />
        </Card.Content>
        <Card.Actions>
          <AppButton
            onPress={() =>
              Alert.alert('Маршрут выбран', `Выбран маршрут ${index + 1}`)
            }>
            {t('buttons.select')}
          </AppButton>
        </Card.Actions>
      </Card>
    );
  };

  if (routes?.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <IconButton
        icon={'arrow-left'}
        mode="contained"
        size={30}
        style={[defaultNoMaarginStyle, styles.backButton]}
        onPress={closeRoutes}
      />
      <FlatList
        ref={flatListRef}
        horizontal
        data={routes}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        snapToInterval={SNAP_INTERVAL}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        initialScrollIndex={selectedRouteIndex !== -1 ? selectedRouteIndex : 0}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    bottom: 20,
    left: 0,
    right: 0,
  },
  item: {
    width: CARD_WIDTH,
    marginRight: 16,
  },
  flatListContent: {
    paddingLeft: 16,
  },
  backButton: {
    marginLeft: 16,
    marginBottom: 16,
  },
});
