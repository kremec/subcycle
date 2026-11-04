import { type FC } from "react";

import { useShallow } from "zustand/react/shallow";

import { Switch } from "@/components/ui/switch";
import { SettingsSectionCard } from "@/screens/settings/components/settings-section-card";
import { useSettingsStore } from "@/stores/settings-store";
import { t } from "@/translation/use-translation";

export const PartnerModeSettingsSection: FC = () => {
  const { partnerMode, updateSettings } = useSettingsStore(
    useShallow((state) => ({
      partnerMode: state.settings.partnerMode,
      updateSettings: state.updateSettings,
    })),
  );

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
