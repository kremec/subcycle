import { type FC } from "react";
import { ScrollView, View } from "react-native";

import { Icon, IconName } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { Typography } from "@/components/ui/typography";
import { symptomGroups } from "@/domain/symptom-groups";
import { useTheme } from "@/theme/use-theme";
import { t } from "@/translation/use-translation";
import type { Symptoms } from "@/types/symptom";

interface SymptomsOverviewProps {
  symptoms: Symptoms;
  onPressEdit: () => void;
}

export const SymptomsOverview: FC<SymptomsOverviewProps> = (props) => {
  const { symptoms, onPressEdit } = props;
  const theme = useTheme();
  const hasSymptoms = symptomGroups.some((group) =>
    group.types.some((symptom) => symptoms[symptom.key]),
  );

  return (
    <View style={{ gap: theme.spacing.md }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: theme.spacing.md,
        }}
      >
        <View style={{ flex: 1, gap: theme.spacing.xxs }}>
          <Typography variant="bodySmallSemibold">
            {t("calendar.symptoms.groups.symptoms")}
          </Typography>
          {!hasSymptoms && (
            <Typography variant="caption" color={theme.colors.textSecondary}>
              {t("calendar.symptoms.empty")}
            </Typography>
          )}
        </View>
        <IconButton
          accessibilityLabel={t("calendar.symptoms.edit")}
          onPress={onPressEdit}
        >
          <Icon name={IconName.PLUS} color={theme.colors.text} size={20} />
        </IconButton>
      </View>
      {hasSymptoms && (
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
                    color={group.color}
                    filled={symptom.filled}
                  />
                )),
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
};
