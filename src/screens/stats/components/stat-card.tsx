import { type FC } from "react";
import { View } from "react-native";

import { Card } from "@/components/ui/card";
import { Icon, type IconName } from "@/components/ui/icon";
import { Typography } from "@/components/ui/typography";
import { useTheme } from "@/theme/use-theme";
import { t } from "@/translation/use-translation";

interface StatCardProps {
  icon: IconName;
  title: string;
  days: number | null;
  filled?: boolean;
}

export const StatCard: FC<StatCardProps> = (props) => {
  const { icon, title, days, filled } = props;
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
          <Typography variant="bodyStrong">
            {days === null
              ? t("common.notAvailable")
              : t("common.days", { count: Math.trunc(days) })}
          </Typography>
        </View>
      </View>
    </Card>
  );
};
