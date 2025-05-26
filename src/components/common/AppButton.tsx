import {getOffset} from '@/utils';
import React from 'react';
import {StyleProp, StyleSheet, TextStyle} from 'react-native';
import {Button, ButtonProps} from 'react-native-paper';

type Props = {
  style?: StyleProp<TextStyle>;
  contentStyle?: StyleProp<TextStyle>;
  textStyle?: StyleProp<TextStyle>;
  pa?: number;
  pv?: number;
  ph?: number;
  pt?: number;
  pr?: number;
  pb?: number;
  pl?: number;
  ma?: number;
  mv?: number;
  mh?: number;
  mt?: number;
  mr?: number;
  mb?: number;
  ml?: number;
};

export const AppButton = ({
  style,
  children,
  onPress,
  contentStyle,
  ...rest
}: ButtonProps & Props) => {
  return (
    <Button
      mode="contained"
      style={[style, getOffset(rest)]}
      contentStyle={[styles.buttonContent, contentStyle]}
      onPress={onPress}
      {...rest}>
      {children}
    </Button>
  );
};

const styles = StyleSheet.create({
  buttonContent: {
    height: 50,
  },
});
