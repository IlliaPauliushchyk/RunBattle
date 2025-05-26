import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';

export const Logo = () => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require('@/assets/images/app_logo.png')}
      />
      <Text variant="bodyLarge">RunBattle</Text>
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
