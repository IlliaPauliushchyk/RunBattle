import {Screens} from '@/constants';
import {HomeScreen} from '@/screens';
import {getTheme} from '@/utils';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {createMaterialBottomTabNavigator} from 'react-native-paper/react-navigation';
// import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createMaterialBottomTabNavigator();

// const CustomTabBarIcon = ({icon, color}: any) => {
//   return <Icon name={icon} size={24} color={color} />;
// };

export const BottomTabNavigator = () => {
  const {t} = useTranslation();

  return (
    <Tab.Navigator theme={getTheme()}>
      <Tab.Screen
        name={Screens.home}
        component={HomeScreen}
        options={{
          title: t('buttons.home'),
          tabBarIcon: 'home',
        }}
      />
    </Tab.Navigator>
  );
};
