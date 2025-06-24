import React, {useState} from 'react';
import {StyleProp, StyleSheet, ViewStyle} from 'react-native';
import {
  HelperText,
  Menu,
  MenuItemProps as PaperMenuItemProps,
} from 'react-native-paper';
import {Input} from './Input';

interface CustomMenuItemProps extends PaperMenuItemProps {
  value: string;
}

type PickerProps = {
  value: string;
  label?: string;
  placeholder?: string;
  touched?: boolean;
  items: CustomMenuItemProps[];
  errorMessage?: string;
  onSelectItem: (item: CustomMenuItemProps) => void;
  style?: StyleProp<ViewStyle>;
} & Omit<React.ComponentProps<typeof Menu>, 'children' | 'anchor' | 'visible'>;

export const Picker: React.FC<PickerProps> = ({
  value,
  label,
  placeholder,
  touched,
  items,
  errorMessage,
  onSelectItem,
  ...otherProps
}) => {
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const selectedValue = items.find(item => item.value === value)?.title;
  const isErrorsExist = errorMessage && touched;

  return (
    <>
      <Menu
        anchor={
          <Input
            onPress={showModal}
            value={selectedValue as string}
            editable={false}
            placeholder={placeholder}
            label={label}
          />
        }
        visible={visible}
        onDismiss={hideModal}
        {...otherProps}>
        {items.map((item, index) => (
          <Menu.Item
            key={`${item.value}-${index}`}
            {...item}
            onPress={e => {
              item.onPress?.(e);
              onSelectItem(item);
              hideModal();
            }}
          />
        ))}
      </Menu>
      {isErrorsExist ? (
        <HelperText type="error" style={styles.errorInput} visible={true}>
          {String(errorMessage)}
        </HelperText>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  errorInput: {
    marginTop: -18,
    marginBottom: 18,
  },
});
