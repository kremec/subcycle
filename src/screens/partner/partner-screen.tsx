import { Fragment, type FC, useState } from "react";
import { ScrollView, View } from "react-native";

import {
  Screen,
  Badge,
  Button,
  Card,
  Icon,
  ListRow,
  SegmentedControl,
  Typography,
} from "@/components/ui";
import { useEventsQuery } from "@/db/queries/use-events-query";
import { usePartnerInsightsQuery } from "@/db/queries/use-partner-insights-query";
import {
  deletePartnerInsight,
  upsertPartnerInsight,
} from "@/db/repositories/partner-insights-repository";
import { getDayInCycle } from "@/domain/events/get-day-in-cycle";
import { getMenstruationPredictions } from "@/domain/predictions/get-menstruation-predictions";
import { getOvulationPredictions } from "@/domain/predictions/get-ovulation-predictions";
import { PartnerInsightDialog } from "@/screens/partner/components/partner-insight-dialog";
import { useSettingsStore } from "@/stores/settings-store";
import { useTheme } from "@/theme/use-theme";
import { formatOrdinal, useT } from "@/translation/use-translation";
import { createDefaultPartnerInsight, type PartnerInsight } from "@/types";

const PartnerScreen: FC = () => {
  const theme = useTheme();
  const t = useT();
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [editingInsight, setEditingInsight] = useState<PartnerInsight | null>(
    null,
  );
  const { data: events } = useEventsQuery();
  const { data: insights } = usePartnerInsightsQuery();
  const {
    settings: { predictionTimespan },
  } = useSettingsStore();

  const allEvents = [
    ...events,
    ...getMenstruationPredictions(events, predictionTimespan),
    ...getOvulationPredictions(events, predictionTimespan),
  ];

  const currentDayInCycle = getDayInCycle(new Date(), allEvents);
  const todayInsight =
    currentDayInCycle === null
      ? null
      : (insights.findLast(
          (insight) => insight.dayInCycle <= currentDayInCycle,
        ) ?? null);

  return (
    <Screen>
      <SegmentedControl
        value={mode}
        onChange={setMode}
        items={[
          {
            value: "view",
            label: t("partner.todayInsights"),
            icon: <Icon name="compass" color={theme.colors.text} size={16} />,
          },
          {
            value: "edit",
            label: t("partner.editInsights"),
            icon: <Icon name="edit" color={theme.colors.text} size={16} />,
          },
        ]}
      />

      {mode === "view" && (
        <Fragment>
          {todayInsight && currentDayInCycle && (
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
                    day: formatOrdinal(currentDayInCycle),
                  })}
                </Badge>
              </View>
              <Typography>{todayInsight.description}</Typography>
            </Card>
          )}
          {(!todayInsight || !currentDayInCycle) && (
            <Typography variant="titleSmall" style={{ textAlign: "center" }}>
              {t("partner.noInsightsFound")}
            </Typography>
          )}
        </Fragment>
      )}

      {mode === "edit" && (
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
                        name="arrow-down"
                        color={theme.colors.textSecondary}
                        size={18}
                      />
                    </View>
                  }
                  onPress={() => setEditingInsight(insight)}
                />
              ))}
            </View>
          </ScrollView>

          <Button
            leftAccessory={
              <Icon name="plus" color={theme.colors.surface} size={16} />
            }
            onPress={() => setEditingInsight(createDefaultPartnerInsight())}
          >
            {t("partner.addInsight")}
          </Button>
        </Fragment>
      )}

      <PartnerInsightDialog
        key={
          editingInsight
            ? `${editingInsight.dayInCycle}-${editingInsight.name}`
            : "empty"
        }
        visible={editingInsight !== null}
        insight={editingInsight}
        onClose={() => setEditingInsight(null)}
        onDelete={(dayInCycle) => {
          deletePartnerInsight(dayInCycle);
          setEditingInsight(null);
        }}
        onSave={(insight) => {
          if (
            editingInsight &&
            editingInsight.dayInCycle !== insight.dayInCycle
          ) {
            deletePartnerInsight(editingInsight.dayInCycle);
          }
          upsertPartnerInsight(insight);
          setEditingInsight(null);
        }}
      />
    </Screen>
  );
};

export default PartnerScreen;
