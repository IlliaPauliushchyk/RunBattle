import React, {ReactNode} from 'react';
import {Appbar} from 'react-native-paper';
import {Logo} from './Logo';

type Props = {
  children?: ReactNode;
  title?: string | ReactNode;
  naviagtion?: any;
  closeModal?: () => void;
};

export const AppHeader = ({title, children, naviagtion, closeModal}: Props) => {
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
      <Appbar.Content title={title ?? <Logo />} />
      {children}
    </Appbar.Header>
  );
};
