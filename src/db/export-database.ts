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

export async function exportDatabase(): Promise<void> {
  logInfo("db.export", "start");

  const exportDb = await openDatabaseAsync(
    EXPORT_DB_NAME,
    { useNewConnection: true },
    defaultDatabaseDirectory,
  );

  await backupDatabaseAsync({
    sourceDatabase: expoDb,
    destDatabase: exportDb,
  })
    .then(async () => {
      const exportPath = `file://${defaultDatabaseDirectory}/${EXPORT_DB_NAME}`;
      await Sharing.shareAsync(exportPath, {
        dialogTitle: t("settings.exportTitle"),
      });

      logInfo("db.export", "share-opened");
    })
    .finally(() =>
      exportDb.closeAsync().catch((error) => {
        logError("db.export", "close-failed", error);
      }),
    );
}
