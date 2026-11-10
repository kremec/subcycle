import { type FC, useState } from "react";
import { Pressable, ScrollView } from "react-native";

import { Button } from "@/components/ui/button";
import { Icon, IconName } from "@/components/ui/icon";
import { Screen } from "@/components/ui/screen";
import { Typography } from "@/components/ui/typography";
import { usePartnerInsightsQuery } from "@/db/repositories/partner-insights-repository";
import { PartnerInsightDialog } from "@/screens/partner/components/partner-insight-dialog";
import { useTheme } from "@/theme/use-theme";
import { t } from "@/translation/use-translation";
import { type PartnerInsight } from "@/types/partner-insight";

type InsightTarget = { insight?: PartnerInsight } | null;

const formatDays = (start: number, next?: number) => {
  if (next === undefined) return t("partner.dayOnward", { day: start });
  if (next - 1 === start) return t("partner.day", { day: start });
  return t("partner.dayRange", { start, end: next - 1 });
};

const PartnerScreen: FC = () => {
  const theme = useTheme();
  const [insightTarget, setInsightTarget] = useState<InsightTarget>(null);
  const { data: insights } = usePartnerInsightsQuery();

  return (
    <Screen edges={["bottom", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Typography
          variant="bodySmall"
          color={theme.colors.textSecondary}
          style={{ paddingBottom: theme.spacing.md }}
        >
          {t("partner.managerDescription")}
        </Typography>
        {insights.length === 0 && (
          <Typography
            variant="titleSmall"
            style={{
              paddingVertical: theme.spacing.lg,
              borderTopWidth: 1,
              borderTopColor: theme.colors.border,
            }}
          >
            {t("partner.noInsightsFound")}
          </Typography>
        )}
        {insights.map((insight, index) => (
          <Pressable
            key={insight.dayInCycle}
            accessibilityRole="button"
            accessibilityHint={t("partner.editNote")}
            onPress={() => setInsightTarget({ insight })}
            style={(state) => ({
              gap: theme.spacing.xs,
              paddingVertical: theme.spacing.lg,
              borderTopWidth: 1,
              borderTopColor: theme.colors.border,
              opacity: state.pressed ? 0.6 : 1,
            })}
          >
            <Typography
              variant="bodySmallSemibold"
              color={theme.colors.textSecondary}
            >
              {formatDays(insight.dayInCycle, insights[index + 1]?.dayInCycle)}
            </Typography>
            <Typography variant="titleSmall">{insight.name}</Typography>
            <Typography
              variant="bodySmall"
              numberOfLines={3}
              color={theme.colors.textSecondary}
            >
              {insight.description}
            </Typography>
          </Pressable>
        ))}
      </ScrollView>

      <Button
        leftAccessory={
          <Icon name={IconName.PLUS} color={theme.colors.surface} size={16} />
        }
        onPress={() => setInsightTarget({})}
      >
        {t("partner.addInsight")}
      </Button>

      {insightTarget && (
        <PartnerInsightDialog
          insight={insightTarget.insight}
          dayInCycle={(insights.at(-1)?.dayInCycle ?? 0) + 1}
          onClose={() => setInsightTarget(null)}
        />
      )}
    </Screen>
  );
};

export default PartnerScreen;
