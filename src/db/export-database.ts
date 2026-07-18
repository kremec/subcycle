import * as Sharing from "expo-sharing";
import {
  backupDatabaseAsync,
  defaultDatabaseDirectory,
  deleteDatabaseAsync,
  openDatabaseSync,
} from "expo-sqlite";

import { expoDb } from "@/db/client";
import { logError, logInfo } from "@/logging/logger";

const EXPORT_DB_NAME = "subcycle-export.db";

export async function exportDatabase(): Promise<void> {
  logInfo("db.export", "start");

  try {
    await deleteDatabaseAsync(EXPORT_DB_NAME, defaultDatabaseDirectory);
  } catch {
    // Ignore missing temp export DB.
  }

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
        dialogTitle: "Export subcycle database",
      });

      logInfo("db.export", "share-opened");
    } finally {
      exportDb.closeSync();
    }
  } catch (error) {
    logError(
      "db.export",
      "failed",
      error instanceof Error ? error : String(error),
    );
    throw error;
  }
}
