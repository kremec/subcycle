import { type FC } from "react";
import { View } from "react-native";

import { router } from "expo-router";

import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { Icon, IconName } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { Typography } from "@/components/ui/typography";
import { BackupsSection } from "@/screens/settings/components/backups-section";
import { MenstruationRemindersSettingsSection } from "@/screens/settings/components/menstruation-reminders-settings-section";
import { PartnerModeSettingsSection } from "@/screens/settings/components/partner-mode-settings-section";
import { PillRemindersSettingsSection } from "@/screens/settings/components/pill-reminders-settings-section";
import { PredictionSettingsSection } from "@/screens/settings/components/prediction-settings-section";
import { useSettingsStore } from "@/stores/settings-store";
import { useTheme } from "@/theme/use-theme";
import { t } from "@/translation/use-translation";

interface SettingsSheetProps {
  visible: boolean;
  onClose: () => void;
}

export const SettingsSheet: FC<SettingsSheetProps> = (props) => {
  const { visible, onClose } = props;
  const theme = useTheme();
  const partnerMode = useSettingsStore((state) => state.settings.partnerMode);

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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="title">{t("navigation.settings")}</Typography>
          <IconButton
            plain
            accessibilityLabel={t("common.close")}
            onPress={onClose}
          >
            <Icon name={IconName.X} size={22} color={theme.colors.text} />
          </IconButton>
        </View>
        <PredictionSettingsSection />
        <PillRemindersSettingsSection />
        <MenstruationRemindersSettingsSection />
        <PartnerModeSettingsSection />
        {partnerMode && (
          <Button
            variant="outline"
            onPress={() => {
              onClose();
              router.push("/partner");
            }}
          >
            {t("partner.editInsights")}
          </Button>
        )}
        <BackupsSection />
      </View>
    </BottomSheet>
  );
};
