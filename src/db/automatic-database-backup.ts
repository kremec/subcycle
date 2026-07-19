import { Directory, File } from "expo-file-system";
import {
  backupDatabaseAsync,
  defaultDatabaseDirectory,
  deleteDatabaseAsync,
  openDatabaseSync,
} from "expo-sqlite";

import { format } from "date-fns";

import { expoDb } from "@/db/client";
import { logError, logInfo } from "@/logging/logger";
import { useSettingsStore } from "@/stores/settings-store";

import NativeReminders from "@modules/subcycle-reminders";

const TEMP_BACKUP_DB_PREFIX = "subcycle-automatic-backup";
const BACKUP_MIME_TYPE = "application/vnd.sqlite3";

async function performDatabaseBackup(directoryUri: string): Promise<void> {
  const tempBackupDbName = `${TEMP_BACKUP_DB_PREFIX}-${Date.now()}.db`;
  const backupDb = openDatabaseSync(
    tempBackupDbName,
    { useNewConnection: true },
    defaultDatabaseDirectory,
  );
  await backupDatabaseAsync({
    sourceDatabase: expoDb,
    destDatabase: backupDb,
  });

  const name = `subcycle-auto-${format(new Date(), "yyyy-MM-dd")}.db`;
  const sourceUri = `file://${defaultDatabaseDirectory}/${tempBackupDbName}`;

  const directory = new Directory(directoryUri);
  const destination =
    directory
      .list()
      .find(
        (entry): entry is File => entry instanceof File && entry.name === name,
      ) ?? directory.createFile(name, BACKUP_MIME_TYPE);

  await new File(sourceUri).copy(destination, { overwrite: true });

  await backupDb.closeAsync();
  await deleteDatabaseAsync(tempBackupDbName, defaultDatabaseDirectory);
}

export async function backupDatabaseAfterWrite(): Promise<void> {
  const { automaticBackupsEnabled, automaticBackupDirectoryUri } =
    useSettingsStore.getState().settings;

  if (!automaticBackupsEnabled || automaticBackupDirectoryUri === null) {
    return;
  }

  try {
    await performDatabaseBackup(automaticBackupDirectoryUri);
    logInfo("db.backup", "complete");
  } catch (error) {
    logError(
      "db.backup",
      "failed",
      error instanceof Error ? error : String(error),
    );
  }
}

export async function syncAutomaticBackupSettings(): Promise<void> {
  const { settings } = useSettingsStore.getState();
  try {
    await NativeReminders.setAutomaticBackupSettings(
      settings.automaticBackupsEnabled,
      settings.automaticBackupDirectoryUri,
    );
  } catch (error) {
    logError(
      "db.backup",
      "sync-native-settings-failed",
      error instanceof Error ? error : String(error),
    );
  }
}
