import { type FC } from "react";

import { Switch } from "@/components/ui";
import { SettingsSectionCard } from "@/screens/settings/components/settings-section-card";
import { useSettingsStore } from "@/stores/settings-store";
import { useT } from "@/translation/use-translation";

export const PartnerModeSettingsSection: FC = () => {
  const t = useT();
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
