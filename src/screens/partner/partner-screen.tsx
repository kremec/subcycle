import { Fragment, type FC, useState } from "react";
import { ScrollView, View } from "react-native";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { ListRow } from "@/components/ui/list-row";
import { Screen } from "@/components/ui/screen";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Typography } from "@/components/ui/typography";
import { useEventsQuery } from "@/db/repositories/events-repository";
import { usePartnerInsightsQuery } from "@/db/repositories/partner-insights-repository";
import {
  deletePartnerInsight,
  upsertPartnerInsight,
} from "@/db/repositories/partner-insights-repository";
import { getDayInCycle, withPredictions } from "@/domain/cycle";
import { PartnerInsightDialog } from "@/screens/partner/components/partner-insight-dialog";
import { useSettingsStore } from "@/stores/settings-store";
import { useTheme } from "@/theme/use-theme";
import { formatOrdinal, t } from "@/translation/use-translation";
import { createDefaultPartnerInsight, type PartnerInsight } from "@/types";

const PartnerScreen: FC = () => {
  const theme = useTheme();
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [editingInsight, setEditingInsight] = useState<PartnerInsight | null>(
    null,
  );
  const { data: events } = useEventsQuery();
  const { data: insights } = usePartnerInsightsQuery();
  const {
    settings: { predictionTimespan },
  } = useSettingsStore();

  const currentDayInCycle = getDayInCycle(
    new Date(),
    withPredictions(events, predictionTimespan),
  );
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

      {mode === "view" &&
        (todayInsight && currentDayInCycle ? (
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
        ) : (
          <Typography variant="titleSmall" style={{ textAlign: "center" }}>
            {t("partner.noInsightsFound")}
          </Typography>
        ))}

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

      {editingInsight && (
        <PartnerInsightDialog
          insight={editingInsight}
          onClose={() => setEditingInsight(null)}
          onDelete={(dayInCycle) => {
            deletePartnerInsight(dayInCycle);
            setEditingInsight(null);
          }}
          onSave={(insight) => {
            if (editingInsight.dayInCycle !== insight.dayInCycle) {
              deletePartnerInsight(editingInsight.dayInCycle);
            }
            upsertPartnerInsight(insight);
            setEditingInsight(null);
          }}
        />
      )}
    </Screen>
  );
};

export default PartnerScreen;
