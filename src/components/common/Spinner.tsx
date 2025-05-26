import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import {useTheme} from 'react-native-paper';

type Props = {
  style?: StyleProp<ViewStyle>;
  barStyle?: 'light-content' | 'dark-content';
  backgroundColor?: string;
};

export const Spinner = ({style, backgroundColor, barStyle}: Props) => {
  const {dark, colors} = useTheme();

  return (
    <>
      <ActivityIndicator
        color={colors.primary}
        size={'large'}
        style={[
          styles.container,
          {backgroundColor: backgroundColor ?? colors.background},
          style,
        ]}
      />
      <StatusBar
        backgroundColor={backgroundColor}
        barStyle={barStyle ? barStyle : dark ? 'light-content' : 'dark-content'}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
