import { Alert } from "react-native";

import * as Sharing from "expo-sharing";
import {
  backupDatabaseAsync,
  defaultDatabaseDirectory,
  openDatabaseAsync,
} from "expo-sqlite";

import { expoDb } from "@/db/client";
import { logError, logInfo } from "@/logging/logger";
import { t } from "@/translation/use-translation";

const EXPORT_DB_NAME = "subcycle-export.db";

export function exportDatabase(): Promise<void> {
  logInfo("db.export", "start");

  return openDatabaseAsync(
    EXPORT_DB_NAME,
    { useNewConnection: true },
    defaultDatabaseDirectory,
  )
    .then((exportDb) =>
      backupDatabaseAsync({
        sourceDatabase: expoDb,
        destDatabase: exportDb,
      }).finally(() => exportDb.closeAsync()),
    )
    .then(async () => {
      const exportPath = `file://${defaultDatabaseDirectory}/${EXPORT_DB_NAME}`;
      await Sharing.shareAsync(exportPath, {
        dialogTitle: t("settings.exportTitle"),
      });
      logInfo("db.export", "share-opened");
    })
    .catch((error) => {
      logError("db.export", "failed", error);
      Alert.alert(t("settings.exportFailed"));
    });
}
