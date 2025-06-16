import {Screens} from '@/constants';
import {defaultContainerStyle} from '@/styles';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import React from 'react';
import {Platform, StatusBar, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import SystemNavigationBar from 'react-native-system-navigation-bar';

export const withStatusBar = (Screen: any) => {
  return (props: any) => {
    const route = useRoute();
    const {colors, dark} = useTheme();

    useFocusEffect(() => {
      switch (route.name) {
        case Screens.welcome:
          if (Platform.OS === 'android') {
            StatusBar.setBackgroundColor('transparent');
          }
          SystemNavigationBar.setNavigationColor('transparent');
          StatusBar.setBarStyle('light-content');
          break;
        default:
          if (Platform.OS === 'android') {
            StatusBar.setBackgroundColor(colors.background);
          }
          SystemNavigationBar.setNavigationColor(colors.surfaceVariant);
          StatusBar.setBarStyle(dark ? 'light-content' : 'dark-content');
      }
    });

    return (
      <View style={defaultContainerStyle}>
        <Screen {...props} />
      </View>
    );
  };
};
