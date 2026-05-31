import { format } from "date-fns";
import { type FC } from "react";
import { ScrollView, View } from "react-native";

import { BottomSheet, Typography } from "@/components/ui";
import { symptomGroups } from "@/domain/symptom-groups";
import { toggleSymptom } from "@/domain/toggle-symptom";
import { SymptomCard } from "@/screens/calendar/components/symptom-card";
import { useTheme } from "@/theme/use-theme";
import { useT } from "@/translation/use-translation";
import type { Symptoms } from "@/types";

interface SymptomsEditSheetProps {
  visible: boolean;
  symptoms: Symptoms;
  onClose: () => void;
  onChange: (symptoms: Symptoms) => void;
}

export const SymptomsEditSheet: FC<SymptomsEditSheetProps> = (props) => {
  const { visible, symptoms, onClose, onChange } = props;
  const theme = useTheme();
  const t = useT();
  const tokenToColor = {
    symptomsSymptoms: theme.colors.symptomsSymptoms,
    symptomsDischarge: theme.colors.symptomsDischarge,
    symptomsLibido: theme.colors.symptomsLibido,
    symptomsExercise: theme.colors.symptomsExercise,
    symptomsMoods: theme.colors.symptomsMoods,
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} snapPoints={["full"]}>
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
                {group.types.map((symptom) => {
                  const key = symptom.key;
                  return (
                    <SymptomCard
                      key={symptom.key}
                      icon={symptom.icon}
                      text={symptom.label}
                      backgroundColor={tokenToColor[group.colorToken]}
                      filled={symptom.filled}
                      selected={symptoms[key]}
                      onPress={() => onChange(toggleSymptom(symptoms, key))}
                    />
                  );
                })}
              </View>
            </ScrollView>
          </View>
        ))}
      </View>
    </BottomSheet>
  );
};
