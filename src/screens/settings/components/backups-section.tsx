import { type FC } from "react";
import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { exportDatabase } from "@/db/export-database";
import { importLatestNativeDatabase } from "@/db/import-database";
import { SettingsSectionCard } from "@/screens/settings/components/settings-section-card";
import { useTheme } from "@/theme/use-theme";
import { t } from "@/translation/use-translation";

export const BackupsSection: FC = () => {
  const theme = useTheme();

  return (
    <SettingsSectionCard
      icon="folder"
      title={t("settings.backups")}
      description={t("settings.backupsDescription")}
    >
      <View style={{ flexDirection: "row", gap: theme.spacing.sm }}>
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
      </View>
    </SettingsSectionCard>
  );
};
