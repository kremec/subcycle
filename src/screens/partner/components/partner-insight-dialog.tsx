import { type FC, useState } from "react";
import { Pressable, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Icon, IconName } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { Typography } from "@/components/ui/typography";
import { useTheme } from "@/theme/use-theme";
import { t } from "@/translation/use-translation";
import {
  partnerInsightSchema,
  type PartnerInsight,
} from "@/types/partner-insight";

interface PartnerInsightDialogProps {
  insight?: PartnerInsight;
  occupiedDays: number[];
  onClose: () => void;
  onDelete: (dayInCycle: number) => void;
  onSave: (insight: PartnerInsight) => void;
}

export const PartnerInsightDialog: FC<PartnerInsightDialogProps> = (props) => {
  const { insight, occupiedDays, onClose, onDelete, onSave } = props;
  const theme = useTheme();
  const [draft, setDraft] = useState(
    () => insight ?? partnerInsightSchema.parse({}),
  );
  const dayOccupied = occupiedDays.includes(draft.dayInCycle);

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
            {t(insight ? "partner.editInsight" : "partner.addInsight")}
          </Typography>
          <IconButton
            plain
            accessibilityLabel={t("common.cancel")}
            onPress={onClose}
          >
            <Icon name={IconName.X} size={22} color={theme.colors.text} />
          </IconButton>
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
          style={{
            minHeight: 88,
          }}
        />
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
          <Typography variant="bodySmall" color={theme.colors.danger}>
            {t("partner.startDayAlreadyUsed")}
          </Typography>
        )}
        <View style={{ flexDirection: "row", gap: theme.spacing.sm }}>
          {insight && (
            <View style={{ flex: 1 }}>
              <Pressable
                accessibilityRole="button"
                style={{
                  minHeight: 44,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => onDelete(insight.dayInCycle)}
              >
                <Typography
                  variant="bodySmallSemibold"
                  color={theme.colors.danger}
                >
                  {t("partner.delete")}
                </Typography>
              </Pressable>
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Button disabled={dayOccupied} onPress={() => onSave(draft)}>
              {t("common.save")}
            </Button>
          </View>
        </View>
      </View>
    </Dialog>
  );
};
