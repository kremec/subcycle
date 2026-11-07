import { type FC, type ReactNode } from "react";
import { Pressable, View } from "react-native";

import { Icon, IconName } from "@/components/ui/icon";
import { Typography } from "@/components/ui/typography";
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
      accessibilityRole="checkbox"
      accessibilityState={{ checked: active }}
      style={{
        borderRadius: theme.radius.lg,
        borderWidth: 1,
        borderColor: active ? theme.colors.text : theme.colors.border,
        backgroundColor: active
          ? theme.colors.backgroundSelected
          : "transparent",
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
        <Typography color={theme.colors.text} style={{ flex: 1 }}>
          {label}
        </Typography>
        <View
          style={{
            width: 12,
            height: 12,
            borderRadius: theme.radius.full,
            backgroundColor: color,
          }}
        />
        {active && (
          <Icon name={IconName.CHECK} size={18} color={theme.colors.text} />
        )}
      </View>
    </Pressable>
  );
};
