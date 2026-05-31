import { type FC, type PropsWithChildren, useEffect, useState } from "react";
import {
  Keyboard,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

import { Card } from "@/components/ui/card";
import { useTheme } from "@/theme/use-theme";

interface DialogProps {
  visible: boolean;
  onClose: () => void;
}

export const Dialog: FC<PropsWithChildren<DialogProps>> = (props) => {
  const { visible, onClose, children } = props;
  const theme = useTheme();
  const { height: windowHeight } = useWindowDimensions();
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (Platform.OS !== "android") {
      return;
    }

    const onShow = Keyboard.addListener("keyboardDidShow", (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const onHide = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      onShow.remove();
      onHide.remove();
    };
  }, []);

  const isKeyboardVisible = Platform.OS === "android" && keyboardHeight > 0;
  const containerPaddingTop = isKeyboardVisible
    ? theme.spacing.md
    : theme.spacing.xl;
  const containerPaddingBottom = isKeyboardVisible
    ? theme.spacing.md + keyboardHeight
    : theme.spacing.xl;
  const maxDialogHeight = !isKeyboardVisible
    ? windowHeight * 0.88
    : Math.max(
        260,
        windowHeight - keyboardHeight - containerPaddingTop - theme.spacing.md,
      );

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.45)",
        }}
      >
        <Pressable onPress={onClose} style={StyleSheet.absoluteFill} />
        <View
          pointerEvents="box-none"
          style={{
            flex: 1,
            justifyContent: isKeyboardVisible ? "flex-start" : "center",
            paddingTop: containerPaddingTop,
            paddingBottom: containerPaddingBottom,
            paddingHorizontal: theme.spacing.xl,
          }}
        >
          <Card
            style={{
              width: "100%",
              alignSelf: "center",
              maxHeight: maxDialogHeight,
              overflow: "hidden",
            }}
          >
            <View>{children}</View>
          </Card>
        </View>
      </View>
    </Modal>
  );
};
