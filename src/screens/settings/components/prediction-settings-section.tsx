import { type FC } from "react";

import { Slider, Typography } from "@/components/ui";
import { SettingsSectionCard } from "@/screens/settings/components/settings-section-card";
import { useSettingsStore } from "@/stores/settings-store";
import { useTheme } from "@/theme/use-theme";
import { useT } from "@/translation/use-translation";

export const PredictionSettingsSection: FC = () => {
  const theme = useTheme();
  const t = useT();
  const {
    settings: { predictionTimespan },
    updateSettings,
  } = useSettingsStore();

  return (
    <SettingsSectionCard
      icon="chart-bubble"
      title={t("settings.menstrualCyclePrediction")}
      description={t("settings.numberOfMonthsForPrediction")}
    >
      <Slider
        commitOnEnd
        min={0}
        max={24}
        step={1}
        value={predictionTimespan}
        onValueChange={(value) => {
          const nextPredictionTimespan = Math.round(value);

          if (nextPredictionTimespan !== predictionTimespan) {
            updateSettings({ predictionTimespan: nextPredictionTimespan });
          }
        }}
      />
      <Typography
        variant="bodySmall"
        style={{ textAlign: "center" }}
        color={theme.colors.textSecondary}
      >
        {predictionTimespan === 0
          ? t("settings.noPredictions")
          : t("settings.predictionMonths", { count: predictionTimespan })}
      </Typography>
    </SettingsSectionCard>
  );
};
