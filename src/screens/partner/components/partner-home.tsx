import { type FC, useState } from "react";
import { Pressable, View } from "react-native";

import { router } from "expo-router";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { usePartnerInsightsQuery } from "@/db/repositories/partner-insights-repository";
import { getDayInCycle, getVisibleCycleEvents } from "@/domain/cycle";
import { PartnerCycleGlance } from "@/screens/partner/components/partner-cycle-glance";
import { PartnerInsightDialog } from "@/screens/partner/components/partner-insight-dialog";
import { PartnerInsightReader } from "@/screens/partner/components/partner-insight-reader";
import { useTheme } from "@/theme/use-theme";
import { t } from "@/translation/use-translation";
import { type Event } from "@/types/event";
import {
  PartnerInsightMode,
  type PartnerInsight,
} from "@/types/partner-insight";

interface PartnerHomeProps {
  events: Event[];
}

export const PartnerHome: FC<PartnerHomeProps> = (props) => {
  const { events } = props;
  const theme = useTheme();
  const { data: insights } = usePartnerInsightsQuery();
  const visibleEvents = getVisibleCycleEvents(events);
  const today = new Date();
  const dayInCycle = getDayInCycle(today, visibleEvents);
  const todayInsight = insights.findLast(
    (insight) => dayInCycle !== null && insight.dayInCycle <= dayInCycle,
  );
  const showAllNotes = dayInCycle === null && insights.length > 0;
  const addLabel = t(
    dayInCycle === null ? "partner.addInsight" : "partner.addTodayNote",
  );
  const emptyDescription =
    dayInCycle === null
      ? t("partner.noCycleDescription")
      : insights.length === 0
        ? t("partner.noNotesDescription")
        : t("partner.noNoteTodayDescription", { day: insights[0].dayInCycle });
  const [target, setTarget] = useState<{
    mode: PartnerInsightMode;
    insight?: PartnerInsight;
  } | null>(null);
  const read = () =>
    setTarget({ mode: PartnerInsightMode.VIEW, insight: todayInsight });
  const edit = () =>
    setTarget({ mode: PartnerInsightMode.EDIT, insight: todayInsight });

  return (
    <View
      style={{
        flex: 1,
        gap: theme.spacing.md,
        paddingBottom: theme.spacing.sm,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: theme.spacing.sm,
        }}
      >
        <Typography
          variant="bodySmallSemibold"
          numberOfLines={1}
          adjustsFontSizeToFit
          maxFontSizeMultiplier={1.5}
          color={theme.colors.textSecondary}
          style={{ flex: 1 }}
        >
          {dayInCycle === null
            ? t("partner.today")
            : t("partner.todayContext", { day: dayInCycle })}
        </Typography>
        <Pressable
          accessibilityRole="button"
          hitSlop={8}
          onPress={() => router.push("/partner")}
          style={(state) => ({
            minHeight: 44,
            justifyContent: "center",
            opacity: state.pressed ? 0.6 : 1,
          })}
        >
          <Typography
            variant="bodySmallSemibold"
            numberOfLines={1}
            maxFontSizeMultiplier={1.5}
            color={theme.colors.accent}
          >
            {t("partner.allNotes")}
          </Typography>
        </Pressable>
      </View>

      <PartnerCycleGlance events={visibleEvents} today={today} />

      <View
        style={{
          flexShrink: 1,
          gap: theme.spacing.lg,
          paddingTop: theme.spacing.lg,
        }}
      >
        {todayInsight && (
          <Pressable
            accessibilityRole="button"
            accessibilityHint={t("partner.readNote")}
            onPress={read}
            style={{ flexShrink: 1, gap: theme.spacing.md }}
          >
            <Typography
              variant="title"
              numberOfLines={3}
              maxFontSizeMultiplier={1.5}
            >
              {todayInsight.name}
            </Typography>
            <Typography
              variant="titleSmallRegular"
              numberOfLines={8}
              maxFontSizeMultiplier={1.5}
              style={{ flexShrink: 1 }}
            >
              {todayInsight.description}
            </Typography>
          </Pressable>
        )}
        {!todayInsight && (
          <View style={{ flexShrink: 1, gap: theme.spacing.md }}>
            <Typography
              variant="title"
              numberOfLines={2}
              maxFontSizeMultiplier={1.5}
            >
              {t(
                dayInCycle === null
                  ? "partner.editInsights"
                  : "partner.noNoteToday",
              )}
            </Typography>
            <Typography
              variant="titleSmallRegular"
              maxFontSizeMultiplier={1.5}
              color={theme.colors.textSecondary}
              style={{ flexShrink: 1 }}
            >
              {emptyDescription}
            </Typography>
          </View>
        )}
        {todayInsight && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: theme.spacing.lg,
            }}
          >
            {[
              {
                label: t("partner.readNote"),
                onPress: read,
                color: theme.colors.accent,
              },
              {
                label: t("partner.editNote"),
                onPress: edit,
                color: theme.colors.textSecondary,
              },
            ].map((action) => (
              <Pressable
                key={action.label}
                accessibilityRole="button"
                onPress={action.onPress}
                style={(state) => ({
                  minHeight: 44,
                  justifyContent: "center",
                  opacity: state.pressed ? 0.6 : 1,
                })}
              >
                <Typography
                  variant="bodySmallSemibold"
                  maxFontSizeMultiplier={1.5}
                  color={action.color}
                >
                  {action.label}
                </Typography>
              </Pressable>
            ))}
          </View>
        )}
        {!todayInsight && (
          <Button onPress={showAllNotes ? () => router.push("/partner") : edit}>
            {showAllNotes ? t("partner.allNotes") : addLabel}
          </Button>
        )}
      </View>

      {target?.mode === PartnerInsightMode.VIEW && target.insight && (
        <PartnerInsightReader
          insight={target.insight}
          onClose={() => setTarget(null)}
          onEdit={() => setTarget({ ...target, mode: PartnerInsightMode.EDIT })}
        />
      )}
      {target?.mode === PartnerInsightMode.EDIT && (
        <PartnerInsightDialog
          insight={target.insight}
          dayInCycle={dayInCycle ?? undefined}
          onClose={() => setTarget(null)}
        />
      )}
    </View>
  );
};
