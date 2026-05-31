import * as Sharing from "expo-sharing";
import {
  backupDatabaseAsync,
  defaultDatabaseDirectory,
  deleteDatabaseAsync,
  openDatabaseSync,
} from "expo-sqlite";

import { expoDb } from "@/db/client";

const EXPORT_DB_NAME = "subcycle-export.db";

export async function exportDatabase(): Promise<void> {
  try {
    await deleteDatabaseAsync(EXPORT_DB_NAME, defaultDatabaseDirectory);
  } catch {
    // Ignore missing temp export DB.
  }

  const exportDb = openDatabaseSync(
    EXPORT_DB_NAME,
    { useNewConnection: true },
    defaultDatabaseDirectory,
  );

  await backupDatabaseAsync({
    sourceDatabase: expoDb,
    destDatabase: exportDb,
  });

  const exportPath = `file://${defaultDatabaseDirectory}/${EXPORT_DB_NAME}`;
  await Sharing.shareAsync(exportPath, {
    dialogTitle: "Export subcycle database",
  });

  exportDb.closeSync();
}
