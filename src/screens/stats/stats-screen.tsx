import { type FC } from "react";

import { Screen } from "@/components/ui/screen";
import { useEventsQuery } from "@/db/repositories/events-repository";
import { getAverageCycleLength, getAveragePeriodLength } from "@/domain/cycle";
import { StatCard } from "@/screens/stats/components/stat-card";
import { useTheme } from "@/theme/use-theme";
import { t } from "@/translation/use-translation";

const StatsScreen: FC = () => {
  const theme = useTheme();
  const { data: events } = useEventsQuery();

  function formatDays(value: number | null): string {
    return value === null
      ? t("common.notAvailable")
      : t("common.days", { count: Math.trunc(value) });
  }

  return (
    <Screen
      style={{
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.md,
        gap: theme.spacing.lg,
      }}
    >
      <StatCard
        icon="reload"
        title={t("stats.averageCycleLength")}
        description={formatDays(getAverageCycleLength(events))}
      />
      <StatCard
        icon="droplet"
        title={t("stats.averagePeriodLength")}
        description={formatDays(getAveragePeriodLength(events))}
      />
      <StatCard
        icon="droplet"
        filled
        title={t("stats.averageHeavyPeriodLength")}
        description={formatDays(
          getAveragePeriodLength(events, (event) => event.menstruationHeavy),
        )}
      />
    </Screen>
  );
};

export default StatsScreen;
