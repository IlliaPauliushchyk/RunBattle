import React from 'react';
import {Image, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';

type Props = {
  width?: number;
  height: number;
  style?: StyleProp<ViewStyle>;
};

export const Logo = ({width, height, style}: Props) => {
  return (
    <View style={[styles.container, style]}>
      <Image
        style={[
          styles.logo,
          {width, height},
          !!width && {borderRadius: width / 2},
        ]}
        source={require('@/assets/images/app_logo.png')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
});
