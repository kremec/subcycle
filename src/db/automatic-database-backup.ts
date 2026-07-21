import { File } from "expo-file-system";
import {
  backupDatabaseAsync,
  defaultDatabaseDirectory,
  deleteDatabaseAsync,
  openDatabaseSync,
} from "expo-sqlite";

import { format } from "date-fns";

import { expoDb } from "@/db/client";
import { logError, logInfo } from "@/logging/logger";

import NativeReminders from "@modules/subcycle-reminders";

function createBackupName(kind: "automatic" | "pre-migration"): string {
  return `subcycle-checkpoint_${kind}_${format(new Date(), "yyyy-MM-dd")}.db`;
}

async function performDatabaseBackup(name: string): Promise<void> {
  const tempBackupDbName = `subcycle-automatic-backup-${Date.now()}.db`;
  const backupDb = openDatabaseSync(
    tempBackupDbName,
    { useNewConnection: true },
    defaultDatabaseDirectory,
  );
  try {
    await backupDatabaseAsync({
      sourceDatabase: expoDb,
      destDatabase: backupDb,
    });

    const directoryUri = await NativeReminders.getBackupDirectoryUri();
    const source = new File(
      `file://${defaultDatabaseDirectory}/${tempBackupDbName}`,
    );
    await source.copy(new File(directoryUri, name), { overwrite: true });
  } finally {
    await backupDb.closeAsync();
    await deleteDatabaseAsync(tempBackupDbName, defaultDatabaseDirectory);
  }
}

export async function backupDatabaseAfterWrite(): Promise<void> {
  try {
    await performDatabaseBackup(createBackupName("automatic"));
    logInfo("db.backup", "complete");
  } catch (error) {
    logError(
      "db.backup",
      "failed",
      error instanceof Error ? error : String(error),
    );
  }
}

export async function backupDatabaseBeforeMigration(): Promise<void> {
  await performDatabaseBackup(createBackupName("pre-migration"));
  logInfo("db.backup", "pre-migration-complete");
}
