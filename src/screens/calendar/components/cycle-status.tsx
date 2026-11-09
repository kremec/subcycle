import { type FC } from "react";

import { differenceInCalendarDays } from "date-fns";

import { Typography } from "@/components/ui/typography";
import { getEventPeriods } from "@/domain/cycle";
import { useTheme } from "@/theme/use-theme";
import { t } from "@/translation/use-translation";
import { type Event } from "@/types/event";

interface CycleStatusProps {
  events: Event[];
}

export const CycleStatus: FC<CycleStatusProps> = (props) => {
  const { events } = props;
  const theme = useTheme();
  const today = new Date();
  const period = getEventPeriods(events).find(
    (entry) => differenceInCalendarDays(entry.end, today) >= 0,
  );
  const current =
    period !== undefined && differenceInCalendarDays(today, period.start) >= 0;
  const target = current ? period?.end : period?.start;
  const days = target ? differenceInCalendarDays(target, today) : null;

  return (
    <Typography
      variant="title"
      color={days === null ? theme.colors.textSecondary : theme.colors.text}
      numberOfLines={2}
      adjustsFontSizeToFit
      maxFontSizeMultiplier={1.5}
      style={{ textAlign: "center", paddingVertical: theme.spacing.md }}
    >
      {days === null
        ? t("calendar.cycleStatus.noMenstruationEvents")
        : t(
            current
              ? "calendar.cycleStatus.periodEndsIn"
              : "calendar.cycleStatus.periodStartsIn",
            { count: days },
          )}
    </Typography>
  );
};
