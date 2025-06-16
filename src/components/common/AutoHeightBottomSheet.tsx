import BottomSheet, {
  BottomSheetProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, {ReactNode, forwardRef} from 'react';

type AutoHeightBottomSheetProps = {
  children: ReactNode;
  maxDynamicContentSize?: number;
} & Omit<BottomSheetProps, 'snapPoints' | 'children'>;

export const AutoHeightBottomSheet = forwardRef<
  BottomSheet,
  AutoHeightBottomSheetProps
>(({children, maxDynamicContentSize = 600, ...rest}, ref) => {
  return (
    <BottomSheet
      ref={ref}
      index={0}
      enableDynamicSizing
      maxDynamicContentSize={maxDynamicContentSize}
      {...rest}>
      <BottomSheetView>{children}</BottomSheetView>
    </BottomSheet>
  );
});

AutoHeightBottomSheet.displayName = 'AutoHeightBottomSheet';
