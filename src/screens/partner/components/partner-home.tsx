import { type FC, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

import { router } from "expo-router";

import { Button } from "@/components/ui/button";
import { Icon, IconName } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { Typography } from "@/components/ui/typography";
import { usePartnerInsightsQuery } from "@/db/repositories/partner-insights-repository";
import { PartnerInsightDialog } from "@/screens/partner/components/partner-insight-dialog";
import { useTheme } from "@/theme/use-theme";
import { dateFormatter, t } from "@/translation/use-translation";

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
  const [editing, setEditing] = useState(false);

  return (
    <View style={{ flex: 2, minHeight: 140, gap: theme.spacing.xs }}>
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
              variant="captionSemibold"
              maxFontSizeMultiplier={1.5}
              color={theme.colors.accent}
            >
              {t("partner.allNotes")}
            </Typography>
          </Pressable>
        )}
      </View>
      {selectedInsight && (
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
            maxFontSizeMultiplier={1.5}
            style={{ flex: 1 }}
          >
            {selectedInsight.name}
          </Typography>
          <IconButton
            plain
            accessibilityLabel={t("partner.editNote")}
            onPress={() => setEditing(true)}
          >
            <Icon
              name={IconName.EDIT}
              size={18}
              color={theme.colors.textSecondary}
            />
          </IconButton>
        </View>
      )}
      <ScrollView
        key={date.toDateString()}
        style={{ flex: 1 }}
        contentContainerStyle={{
          gap: theme.spacing.sm,
          paddingBottom: theme.spacing.sm,
        }}
      >
        {selectedInsight && (
          <Typography variant="bodyRegular" maxFontSizeMultiplier={1.5}>
            {selectedInsight.description}
          </Typography>
        )}
        {!selectedInsight && (
          <View style={{ gap: theme.spacing.sm }}>
            <Typography variant="bodyStrong">
              {t(
                dayInCycle === null
                  ? "partner.editInsights"
                  : "partner.noNoteToday",
              )}
            </Typography>
            <Typography variant="bodySmall" color={theme.colors.textSecondary}>
              {emptyDescription}
            </Typography>
            <Button
              onPress={
                showAllNotes
                  ? () => router.push("/partner")
                  : () => setEditing(true)
              }
            >
              {t(showAllNotes ? "partner.allNotes" : "partner.addInsight")}
            </Button>
          </View>
        )}
      </ScrollView>
      {editing && (
        <PartnerInsightDialog
          insight={selectedInsight}
          dayInCycle={dayInCycle ?? undefined}
          onClose={() => setEditing(false)}
        />
      )}
    </View>
  );
};
