import { type FC } from "react";
import { View } from "react-native";

import { Typography } from "@/components/ui/typography";
import { getPeriodHistory } from "@/domain/cycle";
import { useTheme } from "@/theme/use-theme";
import { t } from "@/translation/use-translation";
import { type Event } from "@/types/event";

interface CycleAveragesProps {
  events: Event[];
}

export const CycleAverages: FC<CycleAveragesProps> = (props) => {
  const { events } = props;
  const theme = useTheme();
  const history = getPeriodHistory(events);
  const averages = [
    { label: t("stats.averageCycleLength"), days: history.averageCycleLength },
    {
      label: t("stats.averagePeriodLength"),
      days: history.averagePeriodLength,
    },
  ];

  return (
    <View style={{ flexDirection: "row", gap: theme.spacing.lg }}>
      {averages.map((average) => (
        <View key={average.label} style={{ flex: 1, gap: theme.spacing.xs }}>
          <Typography variant="bodySmall" color={theme.colors.textSecondary}>
            {average.label}
          </Typography>
          <Typography variant="titleSmall">
            {average.days === null
              ? t("common.notAvailable")
              : t("common.days", { count: Math.round(average.days) })}
          </Typography>
        </View>
      ))}
    </View>
  );
};
