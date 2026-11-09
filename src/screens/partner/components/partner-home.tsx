import { type FC, useState } from "react";
import { Pressable, View } from "react-native";

import { router } from "expo-router";

import { differenceInCalendarDays } from "date-fns";

import { Dialog } from "@/components/ui/dialog";
import { Icon, IconName } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
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
  const [readingInsight, setReadingInsight] = useState(false);
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
    },
    {
      label: t(
        ovulationToday ? "partner.todayOvulation" : "partner.nextOvulation",
      ),
      value: ovulation
        ? dateFormatter.format(ovulation.date)
        : t("partner.noUpcomingOvulation"),
      predicted: ovulation?.prediction ?? false,
    },
  ];

  return (
    <View
      style={{
        flex: 1,
        gap: theme.spacing.lg,
        paddingBottom: theme.spacing.sm,
      }}
    >
      <View>
        <Typography
          variant="bodySmall"
          numberOfLines={1}
          adjustsFontSizeToFit
          maxFontSizeMultiplier={1.5}
          color={theme.colors.textSecondary}
          style={{ textAlign: "center", marginBottom: theme.spacing.lg }}
        >
          {dateFormatter.format(today)}
          {dayInCycle !== null &&
            ` · ${t("partner.dayInCycle", { day: formatOrdinal(dayInCycle) })}`}
        </Typography>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.sm,
          }}
        >
          <Typography
            variant="titleSmall"
            numberOfLines={1}
            adjustsFontSizeToFit
            maxFontSizeMultiplier={1.5}
            style={{ flex: 1 }}
          >
            {t("partner.todayInsights")}
          </Typography>
          <IconButton
            plain
            size={44}
            accessibilityLabel={t("partner.editInsights")}
            onPress={() => router.push("/partner")}
          >
            <Icon name={IconName.EDIT} size={22} color={theme.colors.text} />
          </IconButton>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t(
          todayInsight ? "partner.readInsight" : "partner.addInsight",
        )}
        onPress={() => {
          if (todayInsight) setReadingInsight(true);
          else router.push("/partner");
        }}
        style={(state) => ({
          flexShrink: 1,
          gap: theme.spacing.md,
          padding: theme.spacing.lg,
          borderRadius: theme.radius.lg,
          backgroundColor: theme.colors.backgroundElement,
          opacity: state.pressed ? 0.7 : 1,
        })}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.sm,
          }}
        >
          <Typography
            variant="bodyStrong"
            numberOfLines={2}
            adjustsFontSizeToFit
            maxFontSizeMultiplier={1.5}
            style={{ flex: 1 }}
          >
            {todayInsight?.name ?? t("partner.noInsightsFound")}
          </Typography>
          {todayInsight && (
            <Icon
              name={IconName.CHEVRON_RIGHT}
              size={18}
              color={theme.colors.textSecondary}
            />
          )}
        </View>
        <Typography
          variant="bodySmall"
          numberOfLines={5}
          maxFontSizeMultiplier={1.5}
          style={{ flexShrink: 1 }}
          color={theme.colors.textSecondary}
        >
          {todayInsight?.description ?? t("partner.noInsightsDescription")}
        </Typography>
        {!todayInsight && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: theme.spacing.sm,
            }}
          >
            <Typography
              variant="bodySmallSemibold"
              numberOfLines={1}
              adjustsFontSizeToFit
              maxFontSizeMultiplier={1.5}
            >
              {t("partner.addInsight")}
            </Typography>
            <Icon
              name={IconName.CHEVRON_RIGHT}
              size={18}
              color={theme.colors.text}
            />
          </View>
        )}
      </Pressable>

      <View>
        {upcoming.map((entry) => (
          <View
            key={entry.label}
            style={{
              gap: theme.spacing.xs,
              borderTopWidth: 1,
              borderTopColor: theme.colors.border,
              paddingVertical: theme.spacing.md,
            }}
          >
            <Typography
              variant="caption"
              numberOfLines={1}
              adjustsFontSizeToFit
              maxFontSizeMultiplier={1.5}
              color={theme.colors.textSecondary}
            >
              {entry.label}
              {entry.predicted && ` · ${t("calendar.predicted")}`}
            </Typography>
            <Typography
              variant="bodySemibold"
              numberOfLines={1}
              adjustsFontSizeToFit
              maxFontSizeMultiplier={1.5}
            >
              {entry.value}
            </Typography>
          </View>
        ))}
      </View>

      {readingInsight && todayInsight && (
        <Dialog visible onClose={() => setReadingInsight(false)}>
          <View style={{ gap: theme.spacing.lg }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: theme.spacing.sm,
              }}
            >
              <Typography variant="title" style={{ flex: 1 }}>
                {todayInsight.name}
              </Typography>
              <IconButton
                plain
                accessibilityLabel={t("common.close")}
                onPress={() => setReadingInsight(false)}
              >
                <Icon name={IconName.X} size={22} color={theme.colors.text} />
              </IconButton>
            </View>
            <Typography>{todayInsight.description}</Typography>
          </View>
        </Dialog>
      )}
    </View>
  );
};
