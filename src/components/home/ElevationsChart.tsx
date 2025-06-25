import {commonColors, defaultNoMaarginStyle, defaultRowStyle} from '@/styles';
import * as shape from 'd3-shape';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {IconButton, useTheme} from 'react-native-paper';
import Svg, {G, Line, Path, Rect, Text as SvgText} from 'react-native-svg';
import {AppText} from '../common/AppText';

type ElevationPoint = {
  elevation: number;
};

type ElevationChartProps = {
  width: number;
  height: number;
  elevations: ElevationPoint[];
  distance: number;
  totalAscent: number;
  totalDescent: number;
};

type LegendItemProps = {
  backgroundColor: string;
  title: string;
};

const LegendItem = ({backgroundColor, title}: LegendItemProps) => {
  return (
    <View style={defaultRowStyle}>
      <View style={[styles.legendColor, {backgroundColor}]} />
      <AppText variant="bodySmall">{title}</AppText>
    </View>
  );
};

export const ElevationChart: React.FC<ElevationChartProps> = ({
  width,
  height,
  elevations,
  distance,
  totalAscent,
  totalDescent,
}) => {
  const {t} = useTranslation();
  const {colors} = useTheme();

  if (!elevations || elevations.length < 2) {
    return null;
  }

  const padding = 16;

  // Нормализация данных
  const minElev = Math.min(...elevations.map(e => e.elevation));
  const maxElev = Math.max(...elevations.map(e => e.elevation));
  const elevRange = maxElev - minElev;

  // Форматирование значений
  const formatDistance = (m: number) =>
    m >= 1000
      ? `${(m / 1000).toFixed(1)} ${t('text.km')}`
      : `${m} ${t('text.m')}`;
  const formatElevation = (m: number) => `${Math.round(m)} ${t('text.m')}`;

  // Создание точек для графика
  const points = elevations.map((e, i) => ({
    x: (i / (elevations.length - 1)) * (width - padding * 2),
    y:
      height -
      padding -
      ((e.elevation - minElev) / elevRange) * (height - padding * 2),
  }));

  // Генерация пути
  const line = shape
    .line()
    .x((d: any) => d.x + padding)
    .y((d: any) => d.y)
    .curve(shape.curveNatural)(points as any);

  // Рассчитываем позиции для меток высоты
  const elevationMarkers = [
    {value: maxElev, position: padding + 10},
    {value: minElev, position: height - padding + 10},
  ];

  // Добавляем среднюю метку если перепад значительный
  if (elevRange > 30) {
    elevationMarkers.splice(1, 0, {
      value: Math.round(minElev + elevRange / 2),
      position: height - padding - (height - padding * 2) / 2 + 10,
    });
  }

  return (
    <View style={styles.container}>
      {/* Статистика в строку */}
      <View style={defaultRowStyle}>
        <View style={defaultRowStyle}>
          <IconButton
            style={defaultNoMaarginStyle}
            icon={'arrow-up'}
            size={10}
            mode="contained"
          />
          <AppText variant="bodyMedium" ml={8} mr={16}>
            {formatElevation(totalAscent)}
          </AppText>
        </View>
        <View style={defaultRowStyle}>
          <IconButton
            style={defaultNoMaarginStyle}
            icon={'arrow-down'}
            size={10}
            mode="contained"
          />
          <AppText variant="bodyMedium" ml={8}>
            {formatElevation(totalDescent)}
          </AppText>
        </View>
      </View>

      <Svg width={width} height={height}>
        {/* Ось X */}
        <Line
          translateX={3}
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke={colors.outlineVariant}
          strokeWidth={1}
        />

        {/* Ось Y */}
        <Line
          translateX={3}
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke={colors.outlineVariant}
          strokeWidth={1}
        />

        {/* Градиент под линией */}
        <Path
          translateX={3}
          d={`${line} L ${width - padding},${height - padding} L ${padding},${
            height - padding
          }`}
          fill={commonColors.lightPrimary}
        />

        {/* Линия графика */}
        <Path
          translateX={3}
          d={line as string}
          stroke={colors.primary}
          strokeWidth={2}
          fill="none"
        />

        {/* Подсветка крутых участков */}
        {points.slice(1).map((point, i) => {
          const segmentLength = distance / (elevations.length - 1);
          const elevDiff =
            elevations[i + 1].elevation - elevations[i].elevation;
          const slope = elevDiff / segmentLength;

          if (Math.abs(slope) > 0.07) {
            return (
              <Rect
                key={i}
                x={points[i].x + padding}
                y={Math.min(points[i].y, point.y)}
                width={point.x - points[i].x}
                height={Math.abs(point.y - points[i].y)}
                fill={
                  slope > 0 ? commonColors.lightRed : commonColors.lightGreen
                }
              />
            );
          }
          return null;
        })}

        {/* Метки оси X (дистанция) */}
        <G>
          <SvgText
            x={padding}
            y={height - 1}
            fill={colors.onSurfaceVariant}
            fontSize="10"
            textAnchor="start">
            0
          </SvgText>
          <SvgText
            x={width - padding}
            y={height - 1}
            fill={colors.onSurfaceVariant}
            fontSize="10"
            textAnchor="end">
            {formatDistance(distance)}
          </SvgText>
        </G>

        {/* Метки оси Y (высота) */}
        <G>
          {elevationMarkers.map((marker, i) => (
            <SvgText
              key={i}
              x={padding}
              y={marker.position - 5}
              fill={colors.onSurfaceVariant}
              fontSize="10"
              textAnchor="end">
              {formatElevation(marker.value)}
            </SvgText>
          ))}
        </G>
      </Svg>

      {/* Легенда */}

      <View style={styles.legend}>
        <LegendItem
          title={t('text.steepClimb')}
          backgroundColor={commonColors.lightRed}
        />
        <LegendItem
          title={t('text.steepDescent')}
          backgroundColor={commonColors.lightGreen}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 6,
  },
  legend: {
    flexDirection: 'row',
    // justifyContent: 'center',
    marginTop: 8,
    gap: 16,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
});
