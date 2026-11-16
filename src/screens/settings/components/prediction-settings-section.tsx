import { type FC } from "react";

import { IconName } from "@/components/ui/icon";
import { Switch } from "@/components/ui/switch";
import { SettingsSectionCard } from "@/screens/settings/components/settings-section-card";
import { useSettingsStore } from "@/stores/settings-store";
import { t } from "@/translation/use-translation";

export const PredictionSettingsSection: FC = () => {
  const predictionsEnabled = useSettingsStore(
    (state) => state.settings.predictionsEnabled,
  );
  const hasReminders = useSettingsStore(
    (state) => state.settings.menstruationNotifications.length > 0,
  );
  const updateSettings = useSettingsStore((state) => state.updateSettings);

  return (
    <SettingsSectionCard
      icon={IconName.CHART_BUBBLE}
      title={t("settings.menstrualCyclePrediction")}
      description={
        hasReminders
          ? t("settings.predictionsRequiredForReminders")
          : t("settings.predictionsDescription")
      }
      right={
        <Switch
          accessibilityLabel={t("settings.menstrualCyclePrediction")}
          value={predictionsEnabled}
          disabled={hasReminders}
          onValueChange={(value) =>
            updateSettings({ predictionsEnabled: value })
          }
        />
      }
    />
  );
};
