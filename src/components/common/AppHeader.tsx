import React, {ReactNode} from 'react';
import {Appbar} from 'react-native-paper';
import {Logo} from './Logo';

type Props = {
  children?: ReactNode;
  title?: string | ReactNode;
  naviagtion?: any;
  logo?: boolean;
  closeModal?: () => void;
};

export const AppHeader = ({
  title,
  logo,
  children,
  naviagtion,
  closeModal,
}: Props) => {
  const goBack = () => {
    naviagtion.goBack();
  };

  return (
    <Appbar.Header>
      {naviagtion && (
        <Appbar.BackAction
          onPress={() => (closeModal ? closeModal() : goBack())}
        />
      )}
      <Appbar.Content
        title={logo ? <Logo title={title as string} /> : title ? title : ''}
      />
      {children}
    </Appbar.Header>
  );
};
