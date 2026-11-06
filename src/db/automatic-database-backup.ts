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
  await backupDatabaseAsync({
    sourceDatabase: expoDb,
    destDatabase: backupDb,
  }).finally(() => backupDb.closeAsync());
}

export function backupDatabaseAfterWrite(): Promise<void> {
  return performDatabaseBackup(createBackupName("automatic"))
    .then(() => logInfo("db.backup", "complete"))
    .catch((error) => logError("db.backup", "failed", error));
}

export function backupDatabaseBeforeMigration(): Promise<void> {
  return performDatabaseBackup(createBackupName("pre-migration")).then(() =>
    logInfo("db.backup", "pre-migration-complete"),
  );
}
