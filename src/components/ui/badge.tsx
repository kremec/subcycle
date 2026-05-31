import { type FC, type PropsWithChildren } from "react";
import { View } from "react-native";

import { Typography } from "@/components/ui/typography";
import { useTheme } from "@/theme/use-theme";

interface BadgeProps {
  color?: string;
}

export const Badge: FC<PropsWithChildren<BadgeProps>> = (props) => {
  const { children, color } = props;
  const theme = useTheme();

  return (
    <View
      style={{
        borderRadius: theme.radius.full,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        backgroundColor: color ?? theme.colors.accentSoft,
      }}
    >
      <Typography variant="caption">{children}</Typography>
    </View>
  );
};
