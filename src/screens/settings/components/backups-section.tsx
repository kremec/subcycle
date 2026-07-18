import { type FC } from "react";
import { View } from "react-native";

import { Directory } from "expo-file-system";

import { Button, Icon, Stack, Switch } from "@/components/ui";
import {
  backupDatabaseAfterWrite,
  syncAutomaticBackupSettings,
} from "@/db/automatic-database-backup";
import { exportDatabase } from "@/db/export-database";
import { importLatestNativeDatabase } from "@/db/import-database";
import { SettingsSectionCard } from "@/screens/settings/components/settings-section-card";
import { useSettingsStore } from "@/stores/settings-store";
import { useTheme } from "@/theme/use-theme";
import { useT } from "@/translation/use-translation";

export const BackupsSection: FC = () => {
  const theme = useTheme();
  const t = useT();
  const { settings, updateSettings } = useSettingsStore();

  const setAutomaticBackupsEnabled = async (
    automaticBackupsEnabled: boolean,
  ) => {
    updateSettings({ automaticBackupsEnabled });
    backupDatabaseAfterWrite();
    await syncAutomaticBackupSettings();
  };

  async function selectAutomaticBackupDirectory(
    currentDirectoryUri?: string | null,
  ): Promise<string | null> {
    try {
      const directory = await Directory.pickDirectoryAsync(
        currentDirectoryUri ?? undefined,
      );

      return directory.uri;
    } catch {
      return null;
    }
  }
  const chooseBackupLocation = async () => {
    const directoryUri = await selectAutomaticBackupDirectory(
      settings.automaticBackupDirectoryUri,
    );

    if (directoryUri === null) {
      return;
    }

    updateSettings({ automaticBackupDirectoryUri: directoryUri });
    backupDatabaseAfterWrite();
    await syncAutomaticBackupSettings();
  };

  return (
    <Stack gap={theme.spacing.sm}>
      <SettingsSectionCard
        icon="folder"
        title={t("settings.backups")}
        description={t("settings.backupsDescription")}
        right={
          <Switch
            value={settings.automaticBackupsEnabled}
            onValueChange={setAutomaticBackupsEnabled}
          />
        }
      >
        <Stack direction="column" gap={theme.spacing.sm}>
          {settings.automaticBackupsEnabled && (
            <Button
              variant="outline"
              leftAccessory={
                <Icon name="folder" color={theme.colors.text} size={16} />
              }
              onPress={chooseBackupLocation}
            >
              {t("settings.automaticBackupFolder")}
            </Button>
          )}
          <Stack direction="row" gap={theme.spacing.sm}>
            <View style={{ flex: 1 }}>
              <Button
                variant="outline"
                leftAccessory={
                  <Icon
                    name="file-import"
                    color={theme.colors.text}
                    size={16}
                  />
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
                  <Icon
                    name="file-export"
                    color={theme.colors.text}
                    size={16}
                  />
                }
                onPress={exportDatabase}
              >
                {t("settings.exportData")}
              </Button>
            </View>
          </Stack>
        </Stack>
      </SettingsSectionCard>
    </Stack>
  );
};
