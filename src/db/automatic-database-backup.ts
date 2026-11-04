import { backupDatabaseAsync, openDatabaseSync } from "expo-sqlite";

import { format } from "date-fns";

import { expoDb } from "@/db/client";
import { logError, logInfo } from "@/logging/logger";

import NativeReminders from "@modules/subcycle-reminders";

function createBackupName(kind: "automatic" | "pre-migration"): string {
  return `subcycle-checkpoint_${kind}_${format(new Date(), "yyyy-MM-dd")}.db`;
}

async function performDatabaseBackup(name: string): Promise<void> {
  const directoryUri = await NativeReminders.getBackupDirectoryUri();
  const backupDb = openDatabaseSync(
    name,
    { useNewConnection: true },
    directoryUri,
  );
  try {
    await backupDatabaseAsync({
      sourceDatabase: expoDb,
      destDatabase: backupDb,
    });
  } finally {
    await backupDb.closeAsync();
  }
}

export async function backupDatabaseAfterWrite(): Promise<void> {
  try {
    await performDatabaseBackup(createBackupName("automatic"));
    logInfo("db.backup", "complete");
  } catch (error) {
    logError("db.backup", "failed", error);
  }
}

export async function backupDatabaseBeforeMigration(): Promise<void> {
  await performDatabaseBackup(createBackupName("pre-migration"));
  logInfo("db.backup", "pre-migration-complete");
}
