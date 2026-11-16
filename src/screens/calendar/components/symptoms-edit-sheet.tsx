import { type FC } from "react";
import { ScrollView, View } from "react-native";

import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Typography } from "@/components/ui/typography";
import { getSymptomGroups } from "@/domain/symptom-groups";
import { SymptomCard } from "@/screens/calendar/components/symptom-card";
import { useTheme } from "@/theme/use-theme";
import { dateFormatter, t } from "@/translation/use-translation";
import { type Symptoms, type Symptom } from "@/types/symptom";

interface SymptomsEditSheetProps {
  visible: boolean;
  symptoms: Symptoms;
  onClose: () => void;
  onToggle: (key: Symptom, exclusiveWith: Symptom[]) => void;
}

export const SymptomsEditSheet: FC<SymptomsEditSheetProps> = (props) => {
  const { visible, symptoms, onClose, onToggle } = props;
  const theme = useTheme();

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View
        style={{
          gap: theme.spacing.lg,
          paddingTop: theme.spacing.lg,
          paddingBottom: theme.spacing.xl,
        }}
      >
        <Typography
          variant="title"
          style={{ paddingHorizontal: theme.spacing.lg }}
        >
          {t("calendar.symptoms.title", {
            date: dateFormatter.format(symptoms.date),
          })}
        </Typography>
        {getSymptomGroups(theme.colors).map((group) => (
          <View key={group.name} style={{ gap: theme.spacing.sm }}>
            <Typography
              variant="titleSmall"
              style={{ paddingHorizontal: theme.spacing.lg }}
            >
              {group.name}
            </Typography>
            <ScrollView
              horizontal
              nestedScrollEnabled
              directionalLockEnabled
              bounces={false}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: theme.spacing.lg }}
            >
              <View style={{ flexDirection: "row", gap: theme.spacing.xs }}>
                {group.types.map((symptom) => (
                  <SymptomCard
                    key={symptom.key}
                    icon={symptom.icon}
                    text={symptom.label}
                    color={group.color}
                    filled={symptom.filled}
                    selected={symptoms[symptom.key]}
                    onPress={() =>
                      onToggle(
                        symptom.key,
                        group.exclusive
                          ? group.types.map((item) => item.key)
                          : [],
                      )
                    }
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
