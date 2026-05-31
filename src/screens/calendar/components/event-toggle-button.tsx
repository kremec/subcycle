import { type FC, type ReactNode } from "react";
import { Pressable, View } from "react-native";

import { Typography } from "@/components/ui";
import { useTheme } from "@/theme/use-theme";

interface EventToggleButtonProps {
  label: string;
  icon: ReactNode;
  active: boolean;
  color: string;
  onPress: () => void;
}

export const EventToggleButton: FC<EventToggleButtonProps> = (props) => {
  const { label, icon, active, color, onPress } = props;
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={{
        borderRadius: theme.radius.lg,
        borderWidth: 1,
        borderColor: active ? color : theme.colors.border,
        backgroundColor: active ? color : "transparent",
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: theme.spacing.sm,
        }}
      >
        {icon}
        <Typography color={theme.colors.text}>{label}</Typography>
      </View>
    </Pressable>
  );
};
