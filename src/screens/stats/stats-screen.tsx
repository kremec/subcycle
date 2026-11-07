import { type FC } from "react";

import { IconName } from "@/components/ui/icon";
import { Screen } from "@/components/ui/screen";
import { useEventsQuery } from "@/db/repositories/events-repository";
import { getAverageCycleLength, getAveragePeriodLength } from "@/domain/cycle";
import { StatCard } from "@/screens/stats/components/stat-card";
import { t } from "@/translation/use-translation";

const StatsScreen: FC = () => {
  const { data: events } = useEventsQuery();

  return (
    <Screen scroll edges={["bottom", "left", "right"]}>
      <StatCard
        icon={IconName.RELOAD}
        title={t("stats.averageCycleLength")}
        days={getAverageCycleLength(events)}
      />
      <StatCard
        icon={IconName.DROPLET}
        title={t("stats.averagePeriodLength")}
        days={getAveragePeriodLength(events)}
      />
      <StatCard
        icon={IconName.DROPLET}
        filled
        title={t("stats.averageHeavyPeriodLength")}
        days={getAveragePeriodLength(
          events,
          (event) => event.menstruationHeavy,
        )}
      />
    </Screen>
  );
};

export default StatsScreen;
