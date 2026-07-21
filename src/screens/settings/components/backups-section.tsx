import { type FC } from "react";
import { View } from "react-native";

import { Button, Icon, Stack } from "@/components/ui";
import { exportDatabase } from "@/db/export-database";
import { importLatestNativeDatabase } from "@/db/import-database";
import { SettingsSectionCard } from "@/screens/settings/components/settings-section-card";
import { useTheme } from "@/theme/use-theme";
import { useT } from "@/translation/use-translation";

export const BackupsSection: FC = () => {
  const theme = useTheme();
  const t = useT();

  return (
    <Stack gap={theme.spacing.sm}>
      <SettingsSectionCard
        icon="folder"
        title={t("settings.backups")}
        description={t("settings.backupsDescription")}
      >
        <Stack direction="row" gap={theme.spacing.sm}>
          <View style={{ flex: 1 }}>
            <Button
              variant="outline"
              leftAccessory={
                <Icon name="file-import" color={theme.colors.text} size={16} />
              }
              onPress={importLatestNativeDatabase}
            >
              {t("settings.importData")}
            </Button>
          </View>
          <View style={{ flex: 1 }}>
            <Button
              variant="outline"
              leftAccessory={
                <Icon name="file-export" color={theme.colors.text} size={16} />
              }
              onPress={exportDatabase}
            >
              {t("settings.exportData")}
            </Button>
          </View>
        </Stack>
      </SettingsSectionCard>
    </Stack>
  );
};
