import { type FC, type PropsWithChildren } from "react";
import { View } from "react-native";

import { BottomSheet, RNHostView, ScrollView, type SnapPoint } from "@expo/ui";

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  snapPoints?: SnapPoint[];
}

const Sheet: FC<PropsWithChildren<BottomSheetProps>> = (props) => {
  const { children, visible, onClose, snapPoints = ["full"] } = props;

  return (
    <BottomSheet
      isPresented={visible}
      onDismiss={onClose}
      snapPoints={snapPoints}
    >
      <ScrollView showsIndicators={false}>
        <RNHostView matchContents>
          <View>{children}</View>
        </RNHostView>
      </ScrollView>
    </BottomSheet>
  );
};

export { Sheet as BottomSheet };
