import { type FC } from "react";
import { View } from "react-native";

import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icon";
import { Typography } from "@/components/ui/typography";
import { useTheme } from "@/theme/use-theme";

interface StatCardProps {
  icon: IconName;
  title: string;
  description: string;
  filled?: boolean;
}

export const StatCard: FC<StatCardProps> = (props) => {
  const { icon, title, description, filled } = props;
  const theme = useTheme();

  return (
    <Card>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: theme.spacing.md,
        }}
      >
        <Icon name={icon} size={38} color={theme.colors.text} filled={filled} />
        <View style={{ flex: 1 }}>
          <Typography variant="titleSmall">{title}</Typography>
          <Typography variant="bodyStrong">{description}</Typography>
        </View>
      </View>
    </Card>
  );
};
