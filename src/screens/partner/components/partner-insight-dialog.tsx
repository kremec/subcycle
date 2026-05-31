import { type FC, useState } from "react";
import { View } from "react-native";

import {
  Button,
  Dialog,
  Field,
  NumberField,
  Stack,
  Typography,
} from "@/components/ui";
import { useTheme } from "@/theme/use-theme";
import { useT } from "@/translation/use-translation";
import { createDefaultPartnerInsight, type PartnerInsight } from "@/types";

interface PartnerInsightDialogProps {
  visible: boolean;
  insight: PartnerInsight | null;
  onClose: () => void;
  onDelete: (dayInCycle: number) => void;
  onSave: (insight: PartnerInsight) => void;
}

export const PartnerInsightDialog: FC<PartnerInsightDialogProps> = (props) => {
  const { visible, insight, onClose, onDelete, onSave } = props;
  const theme = useTheme();
  const t = useT();
  const [draft, setDraft] = useState<PartnerInsight>(
    insight ?? createDefaultPartnerInsight(),
  );

  if (!insight) {
    return null;
  }

  return (
    <Dialog visible={visible} onClose={onClose}>
      <Stack gap={theme.spacing.md}>
        <Typography variant="title">
          {insight.dayInCycle === 1 && !insight.name && !insight.description
            ? t("partner.addInsight")
            : t("partner.editInsight")}
        </Typography>
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
        <NumberField
          label={t("partner.startDayInCycle")}
          value={`${draft.dayInCycle}`}
          onChangeText={(value) =>
            setDraft((current) => ({
              ...current,
              dayInCycle: Number(value.replace(/[^0-9]/g, "")) || 1,
            }))
          }
        />
        <Stack direction="row" gap={theme.spacing.sm}>
          <View style={{ flex: 1 }}>
            <Button
              variant="outline"
              onPress={() => onDelete(insight.dayInCycle)}
            >
              {t("partner.delete")}
            </Button>
          </View>
          <View style={{ flex: 1 }}>
            <Button onPress={() => onSave(draft)}>{t("common.save")}</Button>
          </View>
        </Stack>
      </Stack>
    </Dialog>
  );
};
