import { Alert } from "react-native";

import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import {
  defaultDatabaseDirectory,
  openDatabaseAsync,
  type SQLiteDatabase,
} from "expo-sqlite";

import { drizzle } from "drizzle-orm/expo-sqlite";

import { backupDatabaseAfterWrite } from "@/db/automatic-database-backup";
import { db } from "@/db/client";
import { eventsTable, partnerInsightsTable, symptomsTable } from "@/db/schema";
import { logError, logInfo } from "@/logging/logger";
import { t } from "@/translation/use-translation";
import { eventSchema } from "@/types/event";
import { partnerInsightSchema } from "@/types/partner-insight";
import { symptomsSchema } from "@/types/symptom";

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

export function importLatestNativeDatabase(): Promise<void> {
  return pickDatabaseFile()
    .then(async (pickedUri) => {
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
        const events = sourceDb.select().from(eventsTable).all();
        const symptoms = sourceDb.select().from(symptomsTable).all();
        const insights = sourceDb.select().from(partnerInsightsTable).all();
        eventSchema.array().parse(events);
        symptomsSchema.array().parse(symptoms);
        partnerInsightSchema.array().parse(insights);

        db.transaction((transaction) => {
          transaction.delete(eventsTable).run();
          transaction.delete(symptomsTable).run();
          transaction.delete(partnerInsightsTable).run();
          for (const event of events)
            transaction.insert(eventsTable).values(event).run();
          for (const symptom of symptoms)
            transaction.insert(symptomsTable).values(symptom).run();
          for (const insight of insights)
            transaction.insert(partnerInsightsTable).values(insight).run();
        });
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
    })
    .catch((error) => {
      logError("db.import", "failed", error);
      Alert.alert(t("settings.importFailed"));
    });
}
