import { type FC, type PropsWithChildren } from "react";
import { Pressable } from "react-native";

import { useTheme } from "@/theme/use-theme";

interface IconButtonProps {
  onPress?: () => void;
}

export const IconButton: FC<PropsWithChildren<IconButtonProps>> = (props) => {
  const { children, onPress } = props;
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={{
        alignItems: "center",
        justifyContent: "center",
        borderRadius: theme.radius.full,
        borderWidth: 1,
        borderColor: theme.colors.border,
        width: 42,
        height: 42,
        backgroundColor: theme.colors.surface,
      }}
    >
      {children}
    </Pressable>
  );
};
