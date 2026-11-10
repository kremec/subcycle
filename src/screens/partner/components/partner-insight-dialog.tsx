import { type FC, useState } from "react";
import { Alert, Pressable, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Icon, IconName } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { Typography } from "@/components/ui/typography";
import {
  deletePartnerInsight,
  savePartnerInsight,
  usePartnerInsightsQuery,
} from "@/db/repositories/partner-insights-repository";
import { useTheme } from "@/theme/use-theme";
import { t } from "@/translation/use-translation";
import {
  partnerInsightSchema,
  type PartnerInsight,
} from "@/types/partner-insight";

interface PartnerInsightDialogProps {
  insight?: PartnerInsight;
  dayInCycle?: number;
  onClose: () => void;
}

export const PartnerInsightDialog: FC<PartnerInsightDialogProps> = (props) => {
  const { insight, dayInCycle, onClose } = props;
  const theme = useTheme();
  const { data: insights } = usePartnerInsightsQuery();
  const [draft, setDraft] = useState(
    () => insight ?? partnerInsightSchema.parse({ dayInCycle }),
  );
  const dayOccupied = insights.some(
    (entry) =>
      entry.dayInCycle === draft.dayInCycle &&
      entry.dayInCycle !== insight?.dayInCycle,
  );
  const close = (write: Promise<void>) =>
    write.then(onClose, () => Alert.alert(t("common.saveFailed")));

  return (
    <Dialog visible onClose={onClose}>
      <View style={{ gap: theme.spacing.md }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.sm,
          }}
        >
          <Typography variant="title" style={{ flex: 1 }}>
            {t(insight ? "partner.editNote" : "partner.newNote")}
          </Typography>
          <IconButton
            plain
            accessibilityLabel={t("common.cancel")}
            onPress={onClose}
          >
            <Icon name={IconName.X} size={22} color={theme.colors.text} />
          </IconButton>
        </View>
        <View style={{ gap: theme.spacing.xs }}>
          <Field
            keyboardType="number-pad"
            label={t("partner.startDayInCycle")}
            value={`${draft.dayInCycle}`}
            onChangeText={(value) =>
              setDraft((current) => ({
                ...current,
                dayInCycle: Number(value.replace(/[^0-9]/g, "")) || 1,
              }))
            }
          />
          {dayOccupied && (
            <Typography variant="caption" color={theme.colors.danger}>
              {t("partner.startDayAlreadyUsed")}
            </Typography>
          )}
          {!dayOccupied && (
            <Typography variant="caption" color={theme.colors.textSecondary}>
              {t("partner.startDayHint")}
            </Typography>
          )}
        </View>
        <Field
          label={t("partner.name")}
          value={draft.name}
          onChangeText={(name) => setDraft((current) => ({ ...current, name }))}
        />
        <Field
          label={t("partner.description")}
          value={draft.description}
          onChangeText={(description) =>
            setDraft((current) => ({ ...current, description }))
          }
          multiline
          textAlignVertical="top"
          style={{ minHeight: 140 }}
        />
        <View style={{ flexDirection: "row", gap: theme.spacing.sm }}>
          <Button variant="outline" style={{ flex: 1 }} onPress={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            disabled={dayOccupied}
            style={{ flex: 1 }}
            onPress={() =>
              close(savePartnerInsight(draft, insight?.dayInCycle))
            }
          >
            {t("common.save")}
          </Button>
        </View>
        {insight && (
          <Pressable
            accessibilityRole="button"
            style={(state) => ({
              minHeight: 44,
              alignItems: "center",
              justifyContent: "center",
              opacity: state.pressed ? 0.6 : 1,
            })}
            onPress={() => close(deletePartnerInsight(insight.dayInCycle))}
          >
            <Typography variant="bodySmallSemibold" color={theme.colors.danger}>
              {t("partner.delete")}
            </Typography>
          </Pressable>
        )}
      </View>
    </Dialog>
  );
};
