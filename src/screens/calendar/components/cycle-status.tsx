import { Fragment, type FC } from "react";
import { View } from "react-native";

import { differenceInCalendarDays, startOfDay } from "date-fns";

import { Typography } from "@/components/ui/typography";
import { getEventPeriods } from "@/domain/cycle";
import { useTheme } from "@/theme/use-theme";
import { t } from "@/translation/use-translation";
import { isMenstruationEvent, type Event } from "@/types";

interface CycleStatusProps {
  events: Event[];
}

export const CycleStatus: FC<CycleStatusProps> = (props) => {
  const { events } = props;
  const theme = useTheme();

  const today = startOfDay(new Date());
  const currentOrNextPeriod = getEventPeriods(events, isMenstruationEvent).find(
    (entry) => differenceInCalendarDays(entry.end, today) >= 0,
  );
  const isMenstruating =
    currentOrNextPeriod !== undefined &&
    differenceInCalendarDays(today, currentOrNextPeriod.start) >= 0;
  const targetDate = isMenstruating
    ? currentOrNextPeriod?.end
    : currentOrNextPeriod?.start;
  const days = targetDate ? differenceInCalendarDays(targetDate, today) : null;

  return (
    <View
      style={{
        paddingBottom: theme.spacing.lg,
      }}
    >
      {days !== null && (
        <Fragment>
          <Typography variant="display" style={{ textAlign: "center" }}>
            {t("common.days", { count: days })}
          </Typography>
          <Typography variant="titleSmall" style={{ textAlign: "center" }}>
            {isMenstruating
              ? t("calendar.cycleStatus.menstruationLeft")
              : t("calendar.cycleStatus.untilNextMenstruation")}
          </Typography>
        </Fragment>
      )}
      {days === null && (
        <Typography
          variant="bodySmall"
          color={theme.colors.textSecondary}
          style={{ textAlign: "center" }}
        >
          {t("calendar.cycleStatus.noMenstruationEvents")}
        </Typography>
      )}
    </View>
  );
};
