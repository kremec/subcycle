import { type FC } from "react";

import { Screen } from "@/components/ui/screen";
import { useEventsQuery } from "@/db/queries/use-events-query";
import { getAverageCycleLength } from "@/domain/cycle";
import { getAveragePeriodLength } from "@/domain/cycle";
import { StatCard } from "@/screens/stats/components/stat-card";
import { t } from "@/translation/use-translation";

const StatsScreen: FC = () => {
  const { data: events } = useEventsQuery();

  function formatDays(value: number | null): string {
    if (value === null || Number.isNaN(value)) {
      return t("common.notAvailable");
    }

    const days = Math.trunc(value);
    return t("common.days", { count: days });
  }

  return (
    <Screen>
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
