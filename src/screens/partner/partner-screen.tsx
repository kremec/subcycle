import { Fragment, type FC, useState } from "react";
import { ScrollView, View } from "react-native";

import { ListRow } from "@/components/list-row";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon, IconName } from "@/components/ui/icon";
import { Screen } from "@/components/ui/screen";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Typography } from "@/components/ui/typography";
import { useEventsQuery } from "@/db/repositories/events-repository";
import {
  deletePartnerInsight,
  savePartnerInsight,
  usePartnerInsightsQuery,
} from "@/db/repositories/partner-insights-repository";
import { getDayInCycle } from "@/domain/cycle";
import { getAllPredictions } from "@/domain/cycle-predictions";
import { PartnerInsightDialog } from "@/screens/partner/components/partner-insight-dialog";
import { useSettingsStore } from "@/stores/settings-store";
import { useTheme } from "@/theme/use-theme";
import { formatOrdinal, t } from "@/translation/use-translation";
import {
  PartnerInsightMode,
  type PartnerInsight,
} from "@/types/partner-insight";

type InsightTarget = { insight?: PartnerInsight } | null;

const PartnerScreen: FC = () => {
  const theme = useTheme();
  const [mode, setMode] = useState(PartnerInsightMode.VIEW);
  const [insightTarget, setInsightTarget] = useState<InsightTarget>(null);
  const { data: events } = useEventsQuery();
  const { data: insights } = usePartnerInsightsQuery();
  const predictionTimespan = useSettingsStore(
    (state) => state.settings.predictionTimespan,
  );

  const allEvents = getAllPredictions(events, predictionTimespan);
  const dayInCycle = getDayInCycle(new Date(), allEvents);
  const todayInsight = insights.findLast(
    (insight) => dayInCycle !== null && insight.dayInCycle <= dayInCycle,
  );

  return (
    <Screen edges={["bottom", "left", "right"]}>
      <SegmentedControl
        value={mode}
        onChange={setMode}
        items={[
          {
            value: PartnerInsightMode.VIEW,
            label: t("partner.todayInsights"),
            icon: (
              <Icon
                name={IconName.COMPASS}
                color={theme.colors.text}
                size={16}
              />
            ),
          },
          {
            value: PartnerInsightMode.EDIT,
            label: t("partner.editInsights"),
            icon: (
              <Icon name={IconName.EDIT} color={theme.colors.text} size={16} />
            ),
          },
        ]}
      />

      {mode === PartnerInsightMode.VIEW && todayInsight && !!dayInCycle && (
        <Card>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginVertical: theme.spacing.sm,
            }}
          >
            <Typography variant="title">{todayInsight.name}</Typography>
            <Badge>
              {t("partner.dayInCycle", {
                day: formatOrdinal(dayInCycle),
              })}
            </Badge>
          </View>
          <Typography>{todayInsight.description}</Typography>
        </Card>
      )}
      {mode === PartnerInsightMode.VIEW && !todayInsight && (
        <Typography variant="titleSmall" style={{ textAlign: "center" }}>
          {t("partner.noInsightsFound")}
        </Typography>
      )}

      {mode === PartnerInsightMode.EDIT && (
        <Fragment>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ gap: theme.spacing.lg }}>
              {insights.map((insight) => (
                <ListRow
                  key={insight.dayInCycle}
                  title={insight.name}
                  description={insight.description}
                  left={
                    <View style={{ alignItems: "center", width: 36 }}>
                      <Typography variant="bodyStrong">
                        {insight.dayInCycle}
                      </Typography>
                      <Icon
                        name={IconName.ARROW_DOWN}
                        color={theme.colors.textSecondary}
                        size={18}
                      />
                    </View>
                  }
                  onPress={() => setInsightTarget({ insight })}
                />
              ))}
            </View>
          </ScrollView>

          <Button
            leftAccessory={
              <Icon
                name={IconName.PLUS}
                color={theme.colors.surface}
                size={16}
              />
            }
            onPress={() => setInsightTarget({})}
          >
            {t("partner.addInsight")}
          </Button>
        </Fragment>
      )}

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
