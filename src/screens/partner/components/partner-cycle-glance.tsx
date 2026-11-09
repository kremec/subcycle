import { type FC } from "react";
import { View } from "react-native";

import { differenceInCalendarDays } from "date-fns";

import { Typography } from "@/components/ui/typography";
import { getPeriodHistory } from "@/domain/cycle";
import { useTheme } from "@/theme/use-theme";
import { dateFormatter, t } from "@/translation/use-translation";
import { type Event } from "@/types/event";

interface PartnerCycleGlanceProps {
  events: Event[];
}

const formatDistance = (days: number) =>
  days === 0 ? t("partner.today") : t("partner.inDays", { count: days });

export const PartnerCycleGlance: FC<PartnerCycleGlanceProps> = (props) => {
  const { events } = props;
  const theme = useTheme();
  const today = new Date();
  const period = getPeriodHistory(events).periods.find(
    (entry) => differenceInCalendarDays(entry.end, today) >= 0,
  );
  const periodPredicted =
    period?.events.some((event) => event.prediction) ?? false;
  const currentPeriod =
    period !== undefined && differenceInCalendarDays(period.start, today) <= 0;
  const currentPeriodValue = t(
    periodPredicted ? "partner.expectedNow" : "partner.now",
  );
  const ovulation = events.find(
    (event) =>
      event.ovulation && differenceInCalendarDays(event.date, today) >= 0,
  );
  const ovulationDays = ovulation
    ? differenceInCalendarDays(ovulation.date, today)
    : null;
  const cells = [
    {
      label: t(currentPeriod ? "partner.period" : "partner.nextPeriod"),
      value:
        period === undefined
          ? t("partner.notKnownYet")
          : currentPeriod
            ? currentPeriodValue
            : formatDistance(differenceInCalendarDays(period.start, today)),
      detail:
        period &&
        (currentPeriod
          ? t("partner.until", {
              date: dateFormatter.format(period.end),
            })
          : dateFormatter.format(period.start)),
      predicted: periodPredicted,
    },
    {
      label: t(
        ovulationDays === 0 ? "partner.ovulation" : "partner.nextOvulation",
      ),
      value:
        ovulationDays === null
          ? t("partner.notKnownYet")
          : formatDistance(ovulationDays),
      detail: ovulation && dateFormatter.format(ovulation.date),
      predicted: ovulation?.prediction ?? false,
    },
  ];

  return (
    <View
      style={{
        flexDirection: "row",
        gap: theme.spacing.lg,
        paddingTop: theme.spacing.md,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
      }}
    >
      {cells.map((cell) => (
        <View key={cell.label} style={{ flex: 1, gap: theme.spacing.xxs }}>
          <Typography
            variant="caption"
            numberOfLines={1}
            adjustsFontSizeToFit
            maxFontSizeMultiplier={1.5}
            color={theme.colors.textSecondary}
          >
            {cell.label}
          </Typography>
          <Typography
            variant="titleSmall"
            numberOfLines={1}
            adjustsFontSizeToFit
            maxFontSizeMultiplier={1.5}
          >
            {cell.value}
          </Typography>
          {cell.detail && (
            <Typography
              variant="bodySmall"
              numberOfLines={1}
              adjustsFontSizeToFit
              maxFontSizeMultiplier={1.5}
              color={theme.colors.textSecondary}
            >
              {cell.detail}
            </Typography>
          )}
          {cell.predicted && (
            <Typography
              variant="caption"
              maxFontSizeMultiplier={1.5}
              color={theme.colors.textSecondary}
            >
              {t("calendar.predicted")}
            </Typography>
          )}
        </View>
      ))}
    </View>
  );
};
