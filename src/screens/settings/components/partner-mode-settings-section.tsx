import { type FC } from "react";

import { Switch } from "@/components/ui/switch";
import { SettingsSectionCard } from "@/screens/settings/components/settings-section-card";
import { useSettingsStore } from "@/stores/settings-store";
import { t } from "@/translation/use-translation";

export const PartnerModeSettingsSection: FC = () => {
  const {
    settings: { partnerMode },
    updateSettings,
  } = useSettingsStore();

  return (
    <SettingsSectionCard
      icon="user-heart"
      title={t("settings.partnerMode")}
      description={t("settings.partnerModeDescription")}
      right={
        <Switch
          value={partnerMode}
          onValueChange={(value) => updateSettings({ partnerMode: value })}
        />
      }
    />
  );
};
