import { type FC } from "react";
import { View } from "react-native";

import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Typography } from "@/components/ui/typography";
import { BackupsSection } from "@/screens/settings/components/backups-section";
import { MenstruationRemindersSettingsSection } from "@/screens/settings/components/menstruation-reminders-settings-section";
import { PartnerModeSettingsSection } from "@/screens/settings/components/partner-mode-settings-section";
import { PillRemindersSettingsSection } from "@/screens/settings/components/pill-reminders-settings-section";
import { PredictionSettingsSection } from "@/screens/settings/components/prediction-settings-section";
import { useTheme } from "@/theme/use-theme";
import { t } from "@/translation/use-translation";

interface SettingsSheetProps {
  visible: boolean;
  onClose: () => void;
}

export const SettingsSheet: FC<SettingsSheetProps> = (props) => {
  const { visible, onClose } = props;
  const theme = useTheme();

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View
        style={{
          width: "100%",
          maxWidth: 820,
          alignSelf: "center",
          padding: theme.spacing.lg,
          paddingBottom: theme.spacing.xl,
          gap: theme.spacing.lg,
        }}
      >
        <Typography variant="title">{t("navigation.settings")}</Typography>
        <PredictionSettingsSection />
        <PillRemindersSettingsSection />
        <MenstruationRemindersSettingsSection />
        <PartnerModeSettingsSection />
        <BackupsSection />
      </View>
    </BottomSheet>
  );
};
