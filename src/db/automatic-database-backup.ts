import { format } from "date-fns";
import { Directory, File } from "expo-file-system";
import * as FileSystem from "expo-file-system/legacy";
import {
  backupDatabaseAsync,
  defaultDatabaseDirectory,
  deleteDatabaseAsync,
  openDatabaseSync,
} from "expo-sqlite";
import { Platform } from "react-native";

import { expoDb } from "@/db/client";
import { useSettingsStore } from "@/stores/settings-store";

import NativeReminders from "@modules/subcycle-reminders";

const TEMP_BACKUP_DB_PREFIX = "subcycle-automatic-backup";
const BACKUP_MIME_TYPE = "application/vnd.sqlite3";

export async function backupDatabaseAfterWrite(): Promise<void> {
  const { automaticBackupsEnabled, automaticBackupDirectoryUri } =
    useSettingsStore.getState().settings;

  if (!automaticBackupsEnabled || automaticBackupDirectoryUri === null) {
    return;
  }

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

  if (Platform.OS === "android") {
    const backup = await FileSystem.readAsStringAsync(sourceUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const files = await FileSystem.StorageAccessFramework.readDirectoryAsync(
      automaticBackupDirectoryUri,
    );
    const destination =
      files.find((uri) => decodeURIComponent(uri).endsWith(`/${name}`)) ??
      (await FileSystem.StorageAccessFramework.createFileAsync(
        automaticBackupDirectoryUri,
        name,
        BACKUP_MIME_TYPE,
      ));

    await FileSystem.writeAsStringAsync(destination, backup, {
      encoding: FileSystem.EncodingType.Base64,
    });
  } else {
    const directory = new Directory(automaticBackupDirectoryUri);
    const destination =
      directory
        .list()
        .find(
          (entry): entry is File => entry instanceof File && entry.name === name,
        ) ?? directory.createFile(name, BACKUP_MIME_TYPE);

    await new File(sourceUri).copy(destination, { overwrite: true });
  }

  await backupDb.closeAsync();
  await deleteDatabaseAsync(tempBackupDbName, defaultDatabaseDirectory);
}

export async function syncAutomaticBackupSettings(): Promise<void> {
  const { settings } = useSettingsStore.getState();
  await NativeReminders.setAutomaticBackupSettings(
    settings.automaticBackupsEnabled,
    settings.automaticBackupDirectoryUri,
  );
}
