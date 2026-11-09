import { type FC, useState } from "react";
import { Pressable, View } from "react-native";

import { router } from "expo-router";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { usePartnerInsightsQuery } from "@/db/repositories/partner-insights-repository";
import { PartnerInsightDialog } from "@/screens/partner/components/partner-insight-dialog";
import { PartnerInsightReader } from "@/screens/partner/components/partner-insight-reader";
import { useTheme } from "@/theme/use-theme";
import { dateFormatter, t } from "@/translation/use-translation";
import {
  PartnerInsightMode,
  type PartnerInsight,
} from "@/types/partner-insight";

interface PartnerHomeProps {
  date: Date;
  dayInCycle: number | null;
}

export const PartnerHome: FC<PartnerHomeProps> = (props) => {
  const { date, dayInCycle } = props;
  const theme = useTheme();
  const { data: insights } = usePartnerInsightsQuery();
  const selectedInsight = insights.findLast(
    (insight) => dayInCycle !== null && insight.dayInCycle <= dayInCycle,
  );
  const showAllNotes = dayInCycle === null && insights.length > 0;
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
    setTarget({ mode: PartnerInsightMode.VIEW, insight: selectedInsight });
  const edit = () =>
    setTarget({ mode: PartnerInsightMode.EDIT, insight: selectedInsight });

  return (
    <View
      style={{
        flexShrink: 1,
        gap: theme.spacing.sm,
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
          {dateFormatter.format(date)}
          {dayInCycle !== null &&
            ` · ${t("calendar.cycleDay", { day: dayInCycle })}`}
        </Typography>
        {dayInCycle !== null && (
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
        )}
      </View>

      <View
        style={{
          flexShrink: 1,
          gap: theme.spacing.sm,
        }}
      >
        {selectedInsight && (
          <Pressable
            accessibilityRole="button"
            accessibilityHint={t("partner.readNote")}
            onPress={read}
            style={{ flexShrink: 1, gap: theme.spacing.xs }}
          >
            <Typography
              variant="title"
              numberOfLines={1}
              adjustsFontSizeToFit
              maxFontSizeMultiplier={1.5}
            >
              {selectedInsight.name}
            </Typography>
            <Typography
              variant="titleSmallRegular"
              numberOfLines={4}
              maxFontSizeMultiplier={1.5}
              style={{ flexShrink: 1 }}
            >
              {selectedInsight.description}
            </Typography>
          </Pressable>
        )}
        {!selectedInsight && (
          <View style={{ flexShrink: 1, gap: theme.spacing.xs }}>
            <Typography
              variant="titleSmall"
              numberOfLines={1}
              adjustsFontSizeToFit
              maxFontSizeMultiplier={1.5}
            >
              {t(
                dayInCycle === null
                  ? "partner.editInsights"
                  : "partner.noNoteToday",
              )}
            </Typography>
            <Typography
              variant="bodySmall"
              numberOfLines={2}
              maxFontSizeMultiplier={1.5}
              color={theme.colors.textSecondary}
              style={{ flexShrink: 1 }}
            >
              {emptyDescription}
            </Typography>
          </View>
        )}
        {selectedInsight && (
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
        {!selectedInsight && (
          <Button onPress={showAllNotes ? () => router.push("/partner") : edit}>
            {t(showAllNotes ? "partner.allNotes" : "partner.addInsight")}
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
