import { type FC } from "react";

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
  const averages = [];
  if (history.averageCycleLength !== null)
    averages.push(
      t("calendar.averageCycle", {
        count: Math.round(history.averageCycleLength),
      }),
    );
  if (history.averagePeriodLength !== null)
    averages.push(
      t("calendar.averagePeriod", {
        count: Math.round(history.averagePeriodLength),
      }),
    );
  if (averages.length === 0) return null;

  return (
    <Typography
      variant="caption"
      numberOfLines={1}
      adjustsFontSizeToFit
      color={theme.colors.textSecondary}
      style={{ textAlign: "center" }}
    >
      {t("calendar.averages", { values: averages.join(" · ") })}
    </Typography>
  );
};
