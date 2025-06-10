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
  logo?: boolean;
};

export const ScreenContainer = ({
  children,
  type = 'view',
  viewType = 'view',
  style,
  loading,
  navigation,
  title,
  logo,
}: Props) => {
  const {colors} = useTheme();
  const ViewComponent = viewType === 'view' ? View : SafeAreaView;

  const RenderLogo = () => {
    return (
      (title || logo) && (
        <AppHeader logo={logo} naviagtion={navigation} title={title} />
      )
    );
  };

  if (type === 'scrollView') {
    return (
      <ViewComponent style={defaultContainerStyle}>
        {loading ? (
          <View style={defaultContainerStyle}>
            <Spinner />
          </View>
        ) : (
          <>
            <RenderLogo />
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
          <RenderLogo />
          {children}
        </>
      )}
    </ViewComponent>
  );
};
