import { Directory } from "expo-file-system";
import { type FC, useState } from "react";
import { Pressable, View } from "react-native";

import {
  Button,
  Dialog,
  Icon,
  Stack,
  Switch,
  Typography,
} from "@/components/ui";
import { syncAutomaticBackupTaskRegistration } from "@/db/automatic-database-backup";
import { exportDatabase } from "@/db/export-database";
import { importLatestNativeDatabase } from "@/db/import-database";
import { SettingsSectionCard } from "@/screens/settings/components/settings-section-card";
import { useSettingsStore } from "@/stores/settings-store";
import { useTheme } from "@/theme/use-theme";
import { useT } from "@/translation/use-translation";
import type { AutomaticBackupFrequency } from "@/types";

export const DataSettingsSection: FC = () => {
  const theme = useTheme();
  const t = useT();
  const { settings, updateSettings } = useSettingsStore();

  const setAutomaticBackupsEnabled = async (
    automaticBackupsEnabled: boolean,
  ) => {
    updateSettings({ automaticBackupsEnabled });

    await syncAutomaticBackupTaskRegistration();
  };

  const [frequencyDialogVisible, setFrequencyDialogVisible] = useState(false);
  const [draftFrequency, setDraftFrequency] =
    useState<AutomaticBackupFrequency>(settings.automaticBackupFrequency);

  const frequencyOptions: {
    value: AutomaticBackupFrequency;
    label: string;
  }[] = [
    { value: "daily", label: t("settings.backupFrequencyDaily") },
    { value: "weekly", label: t("settings.backupFrequencyWeekly") },
    { value: "monthly", label: t("settings.backupFrequencyMonthly") },
  ];
  const selectedFrequency = frequencyOptions.find(
    (option) => option.value === settings.automaticBackupFrequency,
  );

  const openFrequencyDialog = () => {
    setDraftFrequency(settings.automaticBackupFrequency);
    setFrequencyDialogVisible(true);
  };

  const saveAutomaticBackupFrequency = async () => {
    updateSettings({ automaticBackupFrequency: draftFrequency });
    await syncAutomaticBackupTaskRegistration();
    setFrequencyDialogVisible(false);
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

    await syncAutomaticBackupTaskRegistration();
  };

  return (
    <Stack gap={theme.spacing.sm}>
      <SettingsSectionCard
        icon="folder"
        title={t("settings.automaticBackups")}
        description={t("settings.automaticBackupsDescription")}
        right={
          <Switch
            value={settings.automaticBackupsEnabled}
            onValueChange={setAutomaticBackupsEnabled}
          />
        }
      >
        {settings.automaticBackupsEnabled && (
          <Stack gap={theme.spacing.md}>
            <Stack direction="row" gap={theme.spacing.sm}>
              <View style={{ flex: 1 }}>
                <Button
                  variant="outline"
                  leftAccessory={
                    <Icon name="repeat" color={theme.colors.text} size={16} />
                  }
                  onPress={openFrequencyDialog}
                >
                  {selectedFrequency?.label}
                </Button>
              </View>
              <View style={{ flex: 1 }}>
                <Button
                  variant="outline"
                  leftAccessory={
                    <Icon name="folder" color={theme.colors.text} size={16} />
                  }
                  onPress={chooseBackupLocation}
                >
                  {t("settings.chooseBackupLocation")}
                </Button>
              </View>
            </Stack>

            {settings.lastAutomaticBackupAt !== null && (
              <Typography
                variant="bodySmall"
                color={theme.colors.textSecondary}
              >
                {t("settings.lastAutomaticBackup", {
                  value: new Intl.DateTimeFormat(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(settings.lastAutomaticBackupAt)),
                })}
              </Typography>
            )}

            <Dialog
              visible={frequencyDialogVisible}
              onClose={() => setFrequencyDialogVisible(false)}
            >
              <Stack gap={theme.spacing.md}>
                <View>
                  <Typography variant="title">
                    {t("settings.backupFrequency")}
                  </Typography>
                  <Typography
                    variant="bodySmall"
                    color={theme.colors.textSecondary}
                  >
                    {t("settings.backupFrequencyDescription")}
                  </Typography>
                </View>
                <Stack gap={theme.spacing.sm}>
                  {frequencyOptions.map((option) => (
                    <Pressable
                      key={option.value}
                      onPress={() => setDraftFrequency(option.value)}
                      style={{
                        borderRadius: theme.radius.lg,
                        borderWidth: 1,
                        borderColor:
                          option.value === draftFrequency
                            ? theme.colors.accent
                            : theme.colors.border,
                        paddingHorizontal: theme.spacing.lg,
                        paddingVertical: theme.spacing.md,
                        backgroundColor:
                          option.value === draftFrequency
                            ? theme.colors.accentSoft
                            : "transparent",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: theme.spacing.sm,
                        }}
                      >
                        <Typography variant="bodyStrong">
                          {option.label}
                        </Typography>
                      </View>
                    </Pressable>
                  ))}
                </Stack>

                <Stack direction="row" gap={theme.spacing.sm}>
                  <View style={{ flex: 1 }}>
                    <Button
                      variant="ghost"
                      onPress={() => setFrequencyDialogVisible(false)}
                    >
                      {t("common.close")}
                    </Button>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Button onPress={saveAutomaticBackupFrequency}>
                      {t("common.save")}
                    </Button>
                  </View>
                </Stack>
              </Stack>
            </Dialog>
          </Stack>
        )}
      </SettingsSectionCard>

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
    </Stack>
  );
};
