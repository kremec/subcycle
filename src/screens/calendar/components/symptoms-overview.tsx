import { type FC } from "react";
import { ScrollView, View } from "react-native";

import { format } from "date-fns";

import { Card, Icon, IconButton, Typography } from "@/components/ui";
import { symptomGroups } from "@/domain/symptom-groups";
import { useTheme } from "@/theme/use-theme";
import { useT } from "@/translation/use-translation";
import type { Symptoms } from "@/types";

interface SymptomsOverviewProps {
  selectedDate: Date;
  symptoms: Symptoms;
  onPressEdit: () => void;
}

export const SymptomsOverview: FC<SymptomsOverviewProps> = (props) => {
  const { selectedDate, symptoms, onPressEdit } = props;
  const theme = useTheme();
  const t = useT();

  return (
    <Card style={{ marginBottom: 2 }}>
      <Typography variant="titleSmall">
        {t("calendar.symptoms.title", {
          date: format(selectedDate, "EEE, dd MMM"),
        })}
      </Typography>
      <View
        style={{
          marginTop: theme.spacing.md,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: theme.spacing.md,
        }}
      >
        <IconButton onPress={onPressEdit}>
          <Icon name="plus" color={theme.colors.text} size={20} />
        </IconButton>

        <ScrollView
          horizontal
          nestedScrollEnabled
          directionalLockEnabled
          bounces={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: theme.spacing.xs }}
        >
          <View style={{ flexDirection: "row", gap: theme.spacing.xs }}>
            {symptomGroups.flatMap((group) =>
              group.types.map((symptom) => {
                const active = symptoms[symptom.key];
                if (!active) {
                  return null;
                }

                return (
                  <Icon
                    key={symptom.key}
                    name={symptom.icon}
                    size={34}
                    color={theme.colors[group.colorToken]}
                    filled={symptom.filled}
                  />
                );
              }),
            )}
          </View>
        </ScrollView>
      </View>
    </Card>
  );
};
