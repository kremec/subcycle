import { eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { backupDatabaseAfterWrite } from "@/db/automatic-database-backup";
import { db } from "@/db/client";
import { symptomsTable } from "@/db/schema";
import { logInfo } from "@/logging/logger";
import { hasAnySymptoms, type Symptoms } from "@/types/symptoms";

export function useSymptomsQuery() {
  return useLiveQuery(
    db.select().from(symptomsTable).orderBy(symptomsTable.date),
  );
}

export async function saveSymptoms(symptoms: Symptoms): Promise<void> {
  if (!hasAnySymptoms(symptoms)) {
    return db
      .delete(symptomsTable)
      .where(eq(symptomsTable.date, symptoms.date))
      .then(() => {
        backupDatabaseAfterWrite();
        logInfo("db.symptoms", "delete");
      });
  }

  return db
    .insert(symptomsTable)
    .values(symptoms)
    .onConflictDoUpdate({ target: symptomsTable.date, set: symptoms })
    .then(() => {
      backupDatabaseAfterWrite();
      logInfo("db.symptoms", "upsert");
    });
}
