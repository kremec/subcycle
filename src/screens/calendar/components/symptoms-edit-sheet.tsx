import { type FC } from "react";
import { ScrollView, View } from "react-native";

import { format } from "date-fns";

import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Typography } from "@/components/ui/typography";
import { symptomGroups } from "@/domain/symptom-groups";
import { SymptomCard } from "@/screens/calendar/components/symptom-card";
import { useTheme } from "@/theme/use-theme";
import { t } from "@/translation/use-translation";
import type { Symptoms, SymptomsKey } from "@/types/symptoms";

// Libido levels are mutually exclusive.
const libidoKeys: SymptomsKey[] = [
  "libidoVeryLow",
  "libidoLow",
  "libidoHigh",
  "libidoVeryHigh",
];

interface SymptomsEditSheetProps {
  visible: boolean;
  symptoms: Symptoms;
  onClose: () => void;
  onChange: (symptoms: Symptoms) => void;
}

export const SymptomsEditSheet: FC<SymptomsEditSheetProps> = (props) => {
  const { visible, symptoms, onClose, onChange } = props;
  const theme = useTheme();

  const toggle = (key: SymptomsKey) => {
    const next = { ...symptoms, [key]: !symptoms[key] };
    if (next[key] && libidoKeys.includes(key)) {
      for (const libidoKey of libidoKeys) {
        if (libidoKey !== key) next[libidoKey] = false;
      }
    }
    onChange(next);
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={{ gap: theme.spacing.lg, paddingBottom: theme.spacing.lg }}>
        <Typography variant="title">
          {t("calendar.symptoms.title", {
            date: format(symptoms.date, "EEE, dd MMM"),
          })}
        </Typography>
        {symptomGroups.map((group) => (
          <View key={group.name} style={{ gap: theme.spacing.sm }}>
            <Typography variant="titleSmall">{group.name}</Typography>
            <ScrollView
              horizontal
              nestedScrollEnabled
              directionalLockEnabled
              bounces={false}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: theme.spacing.xs }}
            >
              <View style={{ flexDirection: "row" }}>
                {group.types.map((symptom) => (
                  <SymptomCard
                    key={symptom.key}
                    icon={symptom.icon}
                    text={symptom.label}
                    backgroundColor={theme.colors[group.colorToken]}
                    filled={symptom.filled}
                    selected={symptoms[symptom.key]}
                    onPress={() => toggle(symptom.key)}
                  />
                ))}
              </View>
            </ScrollView>
          </View>
        ))}
      </View>
    </BottomSheet>
  );
};
