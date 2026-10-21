import { type FC } from "react";
import { ScrollView, View } from "react-native";

import { format } from "date-fns";

import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { Typography } from "@/components/ui/typography";
import { symptomGroups } from "@/domain/symptom-groups";
import { useTheme } from "@/theme/use-theme";
import { t } from "@/translation/use-translation";
import type { Symptoms } from "@/types";

interface SymptomsOverviewProps {
  symptoms: Symptoms;
  onPressEdit: () => void;
}

export const SymptomsOverview: FC<SymptomsOverviewProps> = (props) => {
  const { symptoms, onPressEdit } = props;
  const theme = useTheme();

  return (
    <Card style={{ marginBottom: 2 }}>
      <Typography variant="titleSmall">
        {t("calendar.symptoms.title", {
          date: format(symptoms.date, "EEE, dd MMM"),
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
              group.types
                .filter((symptom) => symptoms[symptom.key])
                .map((symptom) => (
                  <Icon
                    key={symptom.key}
                    name={symptom.icon}
                    size={34}
                    color={theme.colors[group.colorToken]}
                    filled={symptom.filled}
                  />
                )),
            )}
          </View>
        </ScrollView>
      </View>
    </Card>
  );
};
