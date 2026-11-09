import { type FC } from "react";
import { View } from "react-native";

import { differenceInCalendarDays } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Icon, IconName } from "@/components/ui/icon";
import { Typography } from "@/components/ui/typography";
import { usePartnerInsightsQuery } from "@/db/repositories/partner-insights-repository";
import {
  getDayInCycle,
  getPeriodHistory,
  getVisibleCycleEvents,
} from "@/domain/cycle";
import { useTheme } from "@/theme/use-theme";
import { dateFormatter, formatOrdinal, t } from "@/translation/use-translation";
import { type Event } from "@/types/event";

interface PartnerHomeProps {
  events: Event[];
}

export const PartnerHome: FC<PartnerHomeProps> = (props) => {
  const { events } = props;
  const theme = useTheme();
  const { data: insights } = usePartnerInsightsQuery();
  const today = new Date();
  const visibleEvents = getVisibleCycleEvents(events);
  const dayInCycle = getDayInCycle(today, visibleEvents);
  const todayInsight = insights.findLast(
    (insight) => dayInCycle !== null && insight.dayInCycle <= dayInCycle,
  );
  const period = getPeriodHistory(visibleEvents).periods.find(
    (entry) => differenceInCalendarDays(entry.end, today) >= 0,
  );
  const currentPeriod =
    period !== undefined && differenceInCalendarDays(period.start, today) <= 0;
  const ovulation = visibleEvents.find(
    (event) =>
      event.ovulation && differenceInCalendarDays(event.date, today) >= 0,
  );
  const ovulationToday =
    ovulation !== undefined &&
    differenceInCalendarDays(ovulation.date, today) === 0;
  const upcoming = [
    {
      label: t(currentPeriod ? "partner.currentPeriod" : "partner.nextPeriod"),
      value: period
        ? dateFormatter.format(period.start) +
          (differenceInCalendarDays(period.end, period.start) > 0
            ? ` – ${dateFormatter.format(period.end)}`
            : "")
        : t("partner.noUpcomingPeriod"),
      predicted: period?.events.some((event) => event.prediction) ?? false,
      icon: IconName.DROPLET,
      color: theme.colors.accent,
    },
    {
      label: t(
        ovulationToday ? "partner.todayOvulation" : "partner.nextOvulation",
      ),
      value: ovulation
        ? dateFormatter.format(ovulation.date)
        : t("partner.noUpcomingOvulation"),
      predicted: ovulation?.prediction ?? false,
      icon: IconName.EGG,
      color: theme.colors.calendarOvulationOutline,
    },
  ];

  return (
    <View style={{ gap: theme.spacing.lg }}>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: theme.spacing.sm,
        }}
      >
        <Typography variant="titleSmall">
          {t("partner.todayInsights")}
        </Typography>
        {dayInCycle !== null && (
          <Badge>
            {t("partner.dayInCycle", { day: formatOrdinal(dayInCycle) })}
          </Badge>
        )}
      </View>

      <Card style={{ gap: theme.spacing.md }}>
        {todayInsight && (
          <Typography variant="title">{todayInsight.name}</Typography>
        )}
        {todayInsight && <Typography>{todayInsight.description}</Typography>}
        {!todayInsight && (
          <Typography variant="titleSmall">
            {t("partner.noInsightsFound")}
          </Typography>
        )}
        {!todayInsight && (
          <Typography color={theme.colors.textSecondary}>
            {t("partner.noInsightsDescription")}
          </Typography>
        )}
      </Card>

      <Card style={{ gap: theme.spacing.md }}>
        {upcoming.map((entry, index) => (
          <View
            key={entry.icon}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: theme.spacing.md,
              borderTopWidth: index === 0 ? 0 : 1,
              borderTopColor: theme.colors.border,
              paddingTop: index === 0 ? 0 : theme.spacing.md,
            }}
          >
            <Icon name={entry.icon} size={24} color={entry.color} />
            <View style={{ flex: 1, gap: theme.spacing.xs }}>
              <Typography
                variant="bodySmall"
                color={theme.colors.textSecondary}
              >
                {entry.label}
              </Typography>
              <Typography variant="bodySemibold">{entry.value}</Typography>
            </View>
            {entry.predicted && <Badge>{t("calendar.predicted")}</Badge>}
          </View>
        ))}
      </Card>
    </View>
  );
};
