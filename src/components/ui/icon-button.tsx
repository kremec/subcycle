import { type FC, type PropsWithChildren } from "react";
import { Pressable, type StyleProp, type ViewStyle } from "react-native";

import { useTheme } from "@/theme/use-theme";

interface IconButtonProps {
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const IconButton: FC<PropsWithChildren<IconButtonProps>> = (props) => {
  const { children, onPress, onLongPress, disabled, style } = props;
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          alignItems: "center",
          justifyContent: "center",
          borderRadius: theme.radius.full,
          borderWidth: 1,
          borderColor: theme.colors.border,
          width: 42,
          height: 42,
          backgroundColor: theme.colors.surface,
          opacity: pressed ? 0.55 : 1,
        },
        style,
      ]}
    >
      {children}
    </Pressable>
  );
};
