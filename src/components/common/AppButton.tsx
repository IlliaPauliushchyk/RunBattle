import {getOffset} from '@/utils';
import React from 'react';
import {StyleProp, StyleSheet, TextStyle} from 'react-native';
import {Button, ButtonProps} from 'react-native-paper';

interface Props extends ButtonProps {
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
  onPress: (args: any) => any;
}

export const AppButton = ({
  style,
  children,
  onPress,
  contentStyle,
  ...rest
}: Props) => {
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
    height: 45,
  },
});
