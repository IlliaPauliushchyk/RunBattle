import {StyleProp, ViewStyle} from 'react-native';

export const defaultContainerStyle = {
  flex: 1,
};

export const defaultRowStyle = {
  flexDirection: 'row',
  alignItems: 'center',
} as StyleProp<ViewStyle>;

export * from './colors';
export * from './navigation';
