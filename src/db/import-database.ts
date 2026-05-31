import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import {
  backupDatabaseAsync,
  defaultDatabaseDirectory,
  deleteDatabaseAsync,
  openDatabaseSync,
} from "expo-sqlite";

import { expoDb } from "@/db/client";

const IMPORT_DB_NAME = "subcycle-import.db";

async function pickDatabaseFile(): Promise<string | null> {
  const result = await DocumentPicker.getDocumentAsync({
    copyToCacheDirectory: true,
  });

  if (result.canceled || result.assets.length === 0) {
    return null;
  }

  return result.assets[0].uri;
}

async function notifyLiveQueriesChanged(): Promise<void> {
  const rows = await expoDb.getAllAsync<{ name: string }>(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'",
  );
  const notifyQueries = rows.map((row) => {
    const tableName = `"${row.name.replaceAll('"', '""')}"`;
    return `DROP TABLE IF EXISTS temp.${tableName};CREATE TEMP TABLE ${tableName}(id);INSERT INTO temp.${tableName} VALUES(1);DROP TABLE temp.${tableName}`;
  });
  await expoDb.execAsync(notifyQueries.join(";"));
}

export async function importLatestNativeDatabase(): Promise<void> {
  const pickedUri = await pickDatabaseFile();
  if (!pickedUri) {
    return;
  }

  try {
    await deleteDatabaseAsync(IMPORT_DB_NAME, defaultDatabaseDirectory);
  } catch {
    // Ignore missing temp import DB.
  }

  const importPath = `${defaultDatabaseDirectory}/${IMPORT_DB_NAME}`;
  await FileSystem.copyAsync({
    from: pickedUri,
    to: `file://${importPath}`,
  });

  const importDb = openDatabaseSync(
    IMPORT_DB_NAME,
    { useNewConnection: true },
    defaultDatabaseDirectory,
  );

  try {
    await backupDatabaseAsync({
      sourceDatabase: importDb,
      destDatabase: expoDb,
    });
    await notifyLiveQueriesChanged();
  } finally {
    importDb.closeSync();
    try {
      await deleteDatabaseAsync(IMPORT_DB_NAME, defaultDatabaseDirectory);
    } catch {
      // Ignore cleanup failures for temp imports.
    }
  }
}
