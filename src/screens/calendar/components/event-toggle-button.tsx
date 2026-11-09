import { type FC } from "react";
import { Pressable, View } from "react-native";

import { Icon, IconName } from "@/components/ui/icon";
import { Typography } from "@/components/ui/typography";
import { useTheme } from "@/theme/use-theme";

interface EventToggleButtonProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

export const EventToggleButton: FC<EventToggleButtonProps> = (props) => {
  const { label, active, onPress } = props;
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked: active }}
      style={(state) => ({
        flexGrow: 1,
        flexBasis: "45%",
        minHeight: 44,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: active ? theme.colors.accent : theme.colors.border,
        backgroundColor: active ? theme.colors.accentSoft : "transparent",
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        opacity: state.pressed ? 0.6 : 1,
      })}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: theme.spacing.sm,
        }}
      >
        <Typography variant="bodySmallSemibold">{label}</Typography>
        {active && (
          <Icon name={IconName.CHECK} size={16} color={theme.colors.text} />
        )}
      </View>
    </Pressable>
  );
};
