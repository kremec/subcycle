import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import {
  backupDatabaseAsync,
  defaultDatabaseDirectory,
  openDatabaseAsync,
  type SQLiteDatabase,
} from "expo-sqlite";

import { drizzle } from "drizzle-orm/expo-sqlite";

import { backupDatabaseAfterWrite } from "@/db/automatic-database-backup";
import { expoDb } from "@/db/client";
import { eventsTable, partnerInsightsTable, symptomsTable } from "@/db/schema";
import { logError, logInfo } from "@/logging/logger";
import { eventSchema } from "@/types/event";
import { partnerInsightSchema } from "@/types/partner-insight";
import { symptomsSchema } from "@/types/symptoms";

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

  logInfo("db.import", "start");

  const importUri = `file://${defaultDatabaseDirectory}/${IMPORT_DB_NAME}`;
  let importDb: SQLiteDatabase | undefined;
  try {
    await FileSystem.copyAsync({
      from: pickedUri,
      to: importUri,
    });

    importDb = await openDatabaseAsync(
      IMPORT_DB_NAME,
      { useNewConnection: true },
      defaultDatabaseDirectory,
    );

    const sourceDb = drizzle(importDb);
    eventSchema.array().parse(sourceDb.select().from(eventsTable).all());
    symptomsSchema.array().parse(sourceDb.select().from(symptomsTable).all());
    partnerInsightSchema
      .array()
      .parse(sourceDb.select().from(partnerInsightsTable).all());

    await backupDatabaseAsync({
      sourceDatabase: importDb,
      destDatabase: expoDb,
    });
    await notifyLiveQueriesChanged();
    backupDatabaseAfterWrite();
    logInfo("db.import", "complete");
  } finally {
    await importDb?.closeAsync().catch((error) => {
      logError("db.import", "close-failed", error);
    });
    await FileSystem.deleteAsync(importUri, { idempotent: true }).catch(
      (error) => {
        logError("db.import", "cleanup-failed", error);
      },
    );
  }
}
