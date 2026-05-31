import { type FC } from "react";

import { Screen } from "@/components/ui/screen";
import { useEventsQuery } from "@/db/queries/use-events-query";
import { getAverageCycleLength } from "@/domain/stats/get-average-cycle-length";
import { getAverageHeavyPeriodLength } from "@/domain/stats/get-average-heavy-period-length";
import { getAveragePeriodLength } from "@/domain/stats/get-average-period-length";
import { StatCard } from "@/screens/stats/components/stat-card";
import { useT } from "@/translation/use-translation";

const StatsScreen: FC = () => {
  const t = useT();
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
        description={formatDays(getAverageHeavyPeriodLength(events))}
      />
    </Screen>
  );
};

export default StatsScreen;
