import { type FC } from "react";
import { Pressable, View } from "react-native";

import { Icon, type IconName } from "@/components/ui/icon";
import { Typography } from "@/components/ui/typography";
import { useTheme } from "@/theme/use-theme";

interface EventToggleButtonProps {
  label: string;
  active: boolean;
  icon?: IconName;
  onPress: () => void;
}

export const EventToggleButton: FC<EventToggleButtonProps> = (props) => {
  const { label, active, icon, onPress } = props;
  const theme = useTheme();
  const color = active ? theme.colors.background : theme.colors.textSecondary;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked: active }}
      style={(state) => ({
        flex: 1,
        minHeight: 44,
        justifyContent: "center",
        borderRadius: 10,
        paddingHorizontal: 4,
        backgroundColor: active ? theme.colors.text : "transparent",
        opacity: state.pressed ? 0.6 : 1,
      })}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
        }}
      >
        {icon && (
          <Icon name={icon} size={16} color={color} filled={icon === "pill"} />
        )}
        <Typography
          variant="captionSemibold"
          color={color}
          numberOfLines={1}
          adjustsFontSizeToFit
          style={{ flexShrink: 1 }}
        >
          {label}
        </Typography>
      </View>
    </Pressable>
  );
};
