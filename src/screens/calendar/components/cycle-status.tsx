import { Fragment, type FC } from "react";
import { View } from "react-native";

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
    <View style={{ paddingVertical: theme.spacing.md, gap: 2 }}>
      {days !== null && (
        <Fragment>
          <Typography
            variant="display"
            numberOfLines={1}
            adjustsFontSizeToFit
            maxFontSizeMultiplier={1.5}
            style={{ textAlign: "center" }}
          >
            {t("common.days", { count: days })}
          </Typography>
          <Typography
            variant="body"
            numberOfLines={1}
            adjustsFontSizeToFit
            maxFontSizeMultiplier={1.5}
            color={theme.colors.textSecondary}
            style={{ textAlign: "center" }}
          >
            {t(
              current
                ? "calendar.cycleStatus.menstruationLeft"
                : "calendar.cycleStatus.untilNextMenstruation",
            )}
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
