import React from 'react';
import {Image, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {AppText} from './AppText';

type Props = {
  width?: number;
  height?: number;
  title?: string;
  style?: StyleProp<ViewStyle>;
};

export const Logo = ({title, width, height, style}: Props) => {
  return (
    <View style={[styles.container, style]}>
      <Image
        style={[
          styles.logo,

          !!width && {borderRadius: width / 2},
          !!width && !!height && {width, height},
        ]}
        source={require('@/assets/images/app_logo.png')}
      />
      {title ? <AppText variant="titleLarge">{title}</AppText> : null}
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
