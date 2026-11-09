import { type FC, useState } from "react";
import { ScrollView, View } from "react-native";

import { ListRow } from "@/components/list-row";
import { Button } from "@/components/ui/button";
import { Icon, IconName } from "@/components/ui/icon";
import { Screen } from "@/components/ui/screen";
import { Typography } from "@/components/ui/typography";
import {
  deletePartnerInsight,
  savePartnerInsight,
  usePartnerInsightsQuery,
} from "@/db/repositories/partner-insights-repository";
import { PartnerInsightDialog } from "@/screens/partner/components/partner-insight-dialog";
import { useTheme } from "@/theme/use-theme";
import { t } from "@/translation/use-translation";
import { type PartnerInsight } from "@/types/partner-insight";

type InsightTarget = { insight?: PartnerInsight } | null;

const PartnerScreen: FC = () => {
  const theme = useTheme();
  const [insightTarget, setInsightTarget] = useState<InsightTarget>(null);
  const { data: insights } = usePartnerInsightsQuery();

  return (
    <Screen edges={["bottom", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ gap: theme.spacing.lg }}>
          {insights.length === 0 && (
            <Typography color={theme.colors.textSecondary}>
              {t("partner.noInsightsFound")}
            </Typography>
          )}
          {insights.map((insight) => (
            <ListRow
              key={insight.dayInCycle}
              title={insight.name}
              description={insight.description}
              left={
                <View style={{ alignItems: "center", width: 56 }}>
                  <Typography variant="captionSemibold">
                    {t("partner.fromDay", { day: insight.dayInCycle })}
                  </Typography>
                </View>
              }
              onPress={() => setInsightTarget({ insight })}
            />
          ))}
        </View>
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
          occupiedDays={insights
            .filter(
              (insight) =>
                insight.dayInCycle !== insightTarget.insight?.dayInCycle,
            )
            .map((insight) => insight.dayInCycle)}
          onClose={() => setInsightTarget(null)}
          onDelete={(dayInCycle) => {
            deletePartnerInsight(dayInCycle);
            setInsightTarget(null);
          }}
          onSave={(insight) =>
            savePartnerInsight(insight, insightTarget.insight?.dayInCycle).then(
              () => setInsightTarget(null),
            )
          }
        />
      )}
    </Screen>
  );
};

export default PartnerScreen;
