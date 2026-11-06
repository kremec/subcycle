import { type FC } from "react";

import { IconName } from "@/components/ui/icon";
import { Screen } from "@/components/ui/screen";
import { useEventsQuery } from "@/db/repositories/events-repository";
import { getAverageCycleLength, getAveragePeriodLength } from "@/domain/cycle";
import { StatCard } from "@/screens/stats/components/stat-card";
import { t } from "@/translation/use-translation";

const StatsScreen: FC = () => {
  const { data: events } = useEventsQuery();

  function formatDays(value: number | null): string {
    if (value === null) return t("common.notAvailable");
    return t("common.days", { count: Math.trunc(value) });
  }

  return (
    <Screen>
      <StatCard
        icon={IconName.RELOAD}
        title={t("stats.averageCycleLength")}
        description={formatDays(getAverageCycleLength(events))}
      />
      <StatCard
        icon={IconName.DROPLET}
        title={t("stats.averagePeriodLength")}
        description={formatDays(getAveragePeriodLength(events))}
      />
      <StatCard
        icon={IconName.DROPLET}
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
