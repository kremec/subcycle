import { type FC } from "react";
import { Pressable, View } from "react-native";

import { Icon, IconName } from "@/components/ui/icon";
import { Typography } from "@/components/ui/typography";

interface EventToggleButtonProps {
  label: string;
  active: boolean;
  icon: IconName;
  color: string;
  backgroundColor: string;
  onPress: () => void;
}

export const EventToggleButton: FC<EventToggleButtonProps> = (props) => {
  const { label, active, icon, color, backgroundColor, onPress } = props;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: active }}
      style={(state) => ({
        flex: 1,
        minHeight: 44,
        justifyContent: "center",
        borderRadius: 12,
        paddingHorizontal: 4,
        backgroundColor: active ? backgroundColor : "transparent",
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
        <Icon
          name={icon}
          size={16}
          color={color}
          filled={icon === IconName.PILL}
        />
        <Typography
          variant="caption"
          color={color}
          numberOfLines={1}
          adjustsFontSizeToFit
          maxFontSizeMultiplier={1.5}
          style={{ flexShrink: 1 }}
        >
          {label}
        </Typography>
      </View>
    </Pressable>
  );
};
