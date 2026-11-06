import { backupDatabaseAsync, openDatabaseAsync } from "expo-sqlite";

import { format } from "date-fns";

import { expoDb } from "@/db/client";
import { logError, logInfo } from "@/logging/logger";

import NativeReminders from "@modules/subcycle-reminders";

export async function backupDatabaseAfterWrite(): Promise<void> {
  const name = `subcycle-checkpoint_automatic_${format(new Date(), "yyyy-MM-dd")}.db`;
  return NativeReminders.getBackupDirectoryUri()
    .then((directory) =>
      openDatabaseAsync(name, { useNewConnection: true }, directory),
    )
    .then((backupDb) =>
      backupDatabaseAsync({
        sourceDatabase: expoDb,
        destDatabase: backupDb,
      }).finally(() => backupDb.closeAsync()),
    )
    .then(() => logInfo("db.backup", "complete"))
    .catch((error) => logError("db.backup", "failed", error));
}
