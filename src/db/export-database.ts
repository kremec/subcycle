import * as Sharing from "expo-sharing";
import {
  backupDatabaseAsync,
  defaultDatabaseDirectory,
  openDatabaseSync,
} from "expo-sqlite";

import { expoDb } from "@/db/client";
import { logError, logInfo } from "@/logging/logger";
import { t } from "@/translation/use-translation";

const EXPORT_DB_NAME = "subcycle-export.db";

export async function exportDatabase(): Promise<void> {
  logInfo("db.export", "start");

  try {
    const exportDb = openDatabaseSync(
      EXPORT_DB_NAME,
      { useNewConnection: true },
      defaultDatabaseDirectory,
    );

    try {
      await backupDatabaseAsync({
        sourceDatabase: expoDb,
        destDatabase: exportDb,
      });

      const exportPath = `file://${defaultDatabaseDirectory}/${EXPORT_DB_NAME}`;
      await Sharing.shareAsync(exportPath, {
        dialogTitle: t("settings.exportTitle"),
      });

      logInfo("db.export", "share-opened");
    } finally {
      try {
        exportDb.closeSync();
      } catch (error) {
        logError("db.export", "close-failed", error);
      }
    }
  } catch (error) {
    logError("db.export", "failed", error);
    throw error;
  }
}
