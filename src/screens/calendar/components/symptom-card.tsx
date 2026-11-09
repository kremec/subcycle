import { type FC } from "react";
import { Pressable, View } from "react-native";

import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icon";
import { Typography } from "@/components/ui/typography";
import { themePalettes } from "@/theme/palette";
import { useTheme } from "@/theme/use-theme";

interface SymptomCardProps {
  icon: IconName;
  text: string;
  backgroundColor: string;
  selected: boolean;
  filled?: boolean;
  onPress: () => void;
}

export const SymptomCard: FC<SymptomCardProps> = (props) => {
  const { icon, text, backgroundColor, selected, filled, onPress } = props;
  const theme = useTheme();
  const color = selected ? themePalettes.light.text : theme.colors.text;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityLabel={text.replaceAll("\n", " ")}
      accessibilityState={{ checked: selected }}
      style={(state) => ({
        minWidth: 84,
        minHeight: 104,
        marginRight: theme.spacing.xs,
        borderRadius: theme.radius.lg,
        backgroundColor: theme.colors.surface,
        opacity: state.pressed ? 0.7 : 1,
        overflow: "hidden",
        borderWidth: selected ? 2 : 0,
        borderColor: theme.colors.text,
        padding: theme.spacing.sm,
        justifyContent: "center",
        alignItems: "center",
      })}
    >
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor,
          opacity: selected ? 1 : 0.4,
        }}
      />
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          gap: theme.spacing.xs,
        }}
      >
        <Icon name={icon} size={36} color={color} filled={filled} />
        <Typography
          variant="caption"
          color={color}
          style={{ textAlign: "center" }}
        >
          {text}
        </Typography>
      </View>
    </Pressable>
  );
};
