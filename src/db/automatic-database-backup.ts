import * as BackgroundTask from "expo-background-task";
import { Directory, File } from "expo-file-system";
import {
  backupDatabaseAsync,
  defaultDatabaseDirectory,
  deleteDatabaseAsync,
  openDatabaseSync,
} from "expo-sqlite";
import * as TaskManager from "expo-task-manager";

import { expoDb } from "@/db/client";
import { useSettingsStore } from "@/stores/settings-store";
import type { AutomaticBackupFrequency } from "@/types";

const AUTOMATIC_DATABASE_BACKUP_TASK = "automatic-database-backup";
const BACKUP_DB_NAME = "subcycle-automatic-backup.db";

const backupFrequencyIntervals: Record<AutomaticBackupFrequency, number> = {
  daily: 24 * 60,
  weekly: 7 * 24 * 60,
  monthly: 30 * 24 * 60,
};

export async function backupDatabaseToDirectory(
  directoryUri: string,
): Promise<void> {
  try {
    await deleteDatabaseAsync(BACKUP_DB_NAME, defaultDatabaseDirectory);
  } catch {
    // Ignore missing temp backup DB.
  }

  const backupDb = openDatabaseSync(
    BACKUP_DB_NAME,
    { useNewConnection: true },
    defaultDatabaseDirectory,
  );

  try {
    await backupDatabaseAsync({
      sourceDatabase: expoDb,
      destDatabase: backupDb,
    });

    const sourceFile = new File(
      `file://${defaultDatabaseDirectory}/${BACKUP_DB_NAME}`,
    );
    const destinationDirectory = new Directory(directoryUri);
    const destinationFile = destinationDirectory.createFile(
      `subcycle-backup-${new Date().toISOString().replaceAll(":", "-")}.db`,
      "application/vnd.sqlite3",
    );
    await sourceFile.copy(destinationFile, { overwrite: true });
  } finally {
    backupDb.closeSync();
    try {
      await deleteDatabaseAsync(BACKUP_DB_NAME, defaultDatabaseDirectory);
    } catch {
      // Ignore temp backup cleanup failures.
    }
  }
}

if (!TaskManager.isTaskDefined(AUTOMATIC_DATABASE_BACKUP_TASK)) {
  TaskManager.defineTask(AUTOMATIC_DATABASE_BACKUP_TASK, async () => {
    const { settings, updateSettings } = useSettingsStore.getState();
    const directoryUri = settings.automaticBackupDirectoryUri;

    if (directoryUri === null) {
      return BackgroundTask.BackgroundTaskResult.Success;
    }

    try {
      await backupDatabaseToDirectory(directoryUri);
      updateSettings({ lastAutomaticBackupAt: Date.now() });
      return BackgroundTask.BackgroundTaskResult.Success;
    } catch {
      return BackgroundTask.BackgroundTaskResult.Failed;
    }
  });
}

export async function syncAutomaticBackupTaskRegistration(): Promise<void> {
  const { settings } = useSettingsStore.getState();
  const enabled =
    settings.automaticBackupsEnabled &&
    settings.automaticBackupDirectoryUri !== null;
  const registered = await TaskManager.isTaskRegisteredAsync(
    AUTOMATIC_DATABASE_BACKUP_TASK,
  );

  if (registered) {
    await BackgroundTask.unregisterTaskAsync(AUTOMATIC_DATABASE_BACKUP_TASK);
  }

  if (!enabled) {
    return;
  }

  const status = await BackgroundTask.getStatusAsync();

  if (status !== BackgroundTask.BackgroundTaskStatus.Available) {
    return;
  }

  await BackgroundTask.registerTaskAsync(AUTOMATIC_DATABASE_BACKUP_TASK, {
    minimumInterval:
      backupFrequencyIntervals[settings.automaticBackupFrequency],
  });
}
