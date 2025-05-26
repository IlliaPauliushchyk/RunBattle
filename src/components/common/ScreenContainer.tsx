import {defaultContainerStyle} from '@/styles';
import React, {ReactNode} from 'react';
import {ScrollView, StyleProp, View, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppHeader} from './AppHeader';
import {Spinner} from './Spinner';

type Props = {
  children: ReactNode;
  type?: 'view' | 'scrollView';
  viewType?: 'view' | 'safeAreaView';
  style?: StyleProp<ViewStyle>;
  loading?: boolean;
  navigation?: any;
  title?: string | ReactNode;
};

export const ScreenContainer = ({
  children,
  type = 'view',
  viewType = 'view',
  style,
  loading,
  navigation,
  title,
}: Props) => {
  const {colors} = useTheme();
  const ViewComponent = viewType === 'view' ? View : SafeAreaView;

  if (type === 'scrollView') {
    return (
      <ViewComponent style={defaultContainerStyle}>
        {loading ? (
          <View style={defaultContainerStyle}>
            <Spinner />
          </View>
        ) : (
          <>
            {title && <AppHeader naviagtion={navigation} title={title} />}
            <ScrollView
              contentContainerStyle={[
                {backgroundColor: colors.background},
                style,
              ]}>
              {children}
            </ScrollView>
          </>
        )}
      </ViewComponent>
    );
  }

  return (
    <ViewComponent
      style={[
        defaultContainerStyle,
        {backgroundColor: colors.background},
        style,
      ]}>
      {loading ? (
        <View style={defaultContainerStyle}>
          <Spinner />
        </View>
      ) : (
        <>
          {title && <AppHeader naviagtion={navigation} title={title} />}
          {children}
        </>
      )}
    </ViewComponent>
  );
};
