import { type FC } from "react";

import { Screen } from "@/components/ui";
import { BackupsSection } from "@/screens/settings/components/backups-section";
import { MenstruationRemindersSettingsSection } from "@/screens/settings/components/menstruation-reminders-settings-section";
import { PartnerModeSettingsSection } from "@/screens/settings/components/partner-mode-settings-section";
import { PillRemindersSettingsSection } from "@/screens/settings/components/pill-reminders-settings-section";
import { PredictionSettingsSection } from "@/screens/settings/components/prediction-settings-section";

const SettingsScreen: FC = () => {
  return (
    <Screen scroll>
      <PredictionSettingsSection />

      <PillRemindersSettingsSection />

      <MenstruationRemindersSettingsSection />

      <PartnerModeSettingsSection />

      <BackupsSection />
    </Screen>
  );
};

export default SettingsScreen;
