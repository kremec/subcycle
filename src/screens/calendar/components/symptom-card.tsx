import { type FC } from "react";
import { Pressable, View } from "react-native";

import { Icon, Typography } from "@/components/ui";
import type { IconName } from "@/components/ui/icon";
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

  return (
    <Pressable
      onPress={onPress}
      style={{
        minWidth: 84,
        height: 104,
        marginRight: theme.spacing.xs,
        borderRadius: theme.radius.lg,
        backgroundColor,
        opacity: selected ? 1 : 0.4,
        borderWidth: selected ? 2 : 0,
        borderColor: theme.colors.text,
        padding: theme.spacing.sm,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          gap: theme.spacing.xs,
        }}
      >
        <Icon name={icon} size={36} color={theme.colors.text} filled={filled} />
        <Typography variant="caption" style={{ textAlign: "center" }}>
          {text}
        </Typography>
      </View>
    </Pressable>
  );
};
