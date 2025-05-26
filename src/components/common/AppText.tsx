import {getOffset} from '@/utils';
import React from 'react';
import {StyleProp, TextProps, TextStyle} from 'react-native';
import {Text} from 'react-native-paper';
import {VariantProp} from 'react-native-paper/lib/typescript/components/Typography/types';

type Props = {
  style?: StyleProp<TextStyle>;
  fontWeight?: string;
  color?: string;
  size?: number;
  textAlign?: string;
  textStyle?: StyleProp<TextStyle>;
  lineH?: number;
  variant?: VariantProp<never> | undefined;
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

export const AppText = ({
  style,
  fontWeight,
  children,
  numberOfLines,
  onPress,
  textAlign,
  textStyle,
  lineH,
  variant,
  color,
  ...rest
}: TextProps & Props) => {
  return (
    <Text
      style={[
        textStyle,
        {
          // color,
          textAlign,
          fontWeight,
          lineHeight: lineH,
        },
        color && {color},
        style,
        getOffset(rest),
      ]}
      numberOfLines={numberOfLines}
      onPress={onPress}
      {...rest}
      variant={variant}>
      {children}
    </Text>
  );
};
