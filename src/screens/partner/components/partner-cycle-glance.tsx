import { type FC } from "react";
import { View } from "react-native";

import { differenceInCalendarDays } from "date-fns";

import { Typography } from "@/components/ui/typography";
import { getPeriodHistory } from "@/domain/cycle";
import { useTheme } from "@/theme/use-theme";
import { locale, t } from "@/translation/use-translation";
import { type Event } from "@/types/event";

interface PartnerCycleGlanceProps {
  events: Event[];
}

const shortDateFormatter = new Intl.DateTimeFormat(locale, {
  calendar: "gregory",
  month: "short",
  day: "numeric",
});

export const PartnerCycleGlance: FC<PartnerCycleGlanceProps> = (props) => {
  const { events } = props;
  const theme = useTheme();
  const today = new Date();
  const period = getPeriodHistory(events).periods.find(
    (entry) => differenceInCalendarDays(entry.end, today) >= 0,
  );
  const ovulation = events.find(
    (event) =>
      event.ovulation && differenceInCalendarDays(event.date, today) >= 0,
  );
  let periodValue = t("partner.notKnownYet");
  if (period) {
    const predicted = period.events.some((event) => event.prediction);
    if (differenceInCalendarDays(period.start, today) <= 0) {
      periodValue = t(predicted ? "partner.expectedUntil" : "partner.until", {
        date: shortDateFormatter.format(period.end),
      });
    } else {
      periodValue = shortDateFormatter.format(period.start);
      if (predicted) periodValue += ` · ${t("calendar.predicted")}`;
    }
  }
  let ovulationValue = ovulation
    ? shortDateFormatter.format(ovulation.date)
    : t("partner.notKnownYet");
  if (ovulation?.prediction) ovulationValue += ` · ${t("calendar.predicted")}`;

  return (
    <View style={{ gap: theme.spacing.xs, paddingTop: theme.spacing.sm }}>
      {[
        { label: t("partner.period"), value: periodValue },
        { label: t("partner.ovulation"), value: ovulationValue },
      ].map((cell) => (
        <View
          key={cell.label}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.md,
          }}
        >
          <Typography
            variant="bodySmall"
            maxFontSizeMultiplier={1.5}
            color={theme.colors.textSecondary}
          >
            {cell.label}
          </Typography>
          <Typography
            variant="bodySmallSemibold"
            numberOfLines={1}
            adjustsFontSizeToFit
            maxFontSizeMultiplier={1.5}
            style={{ flex: 1, textAlign: "right" }}
          >
            {cell.value}
          </Typography>
        </View>
      ))}
    </View>
  );
};
