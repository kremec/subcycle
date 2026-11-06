import { eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { backupDatabaseAfterWrite } from "@/db/automatic-database-backup";
import { db } from "@/db/client";
import { symptomsTable } from "@/db/schema";
import { fromEpochDay, toEpochDay } from "@/domain/time";
import { logInfo } from "@/logging/logger";
import {
  hasAnySymptoms,
  mapSymptomsKeys,
  type Symptoms,
} from "@/types/symptoms";

export function useSymptomsQuery(): { data: Symptoms[]; error?: Error } {
  const query = useLiveQuery(
    db.select().from(symptomsTable).orderBy(symptomsTable.date),
  );

  return {
    data: query.data.flatMap((row) => {
      const date = fromEpochDay(row.date);
      if (!date) return [];
      return [{ date, ...mapSymptomsKeys((key) => Boolean(row[key])) }];
    }),
    error: query.error,
  };
}

export async function saveSymptoms(symptoms: Symptoms): Promise<void> {
  if (!hasAnySymptoms(symptoms)) {
    return db
      .delete(symptomsTable)
      .where(eq(symptomsTable.date, toEpochDay(symptoms.date)))
      .then(() => {
        backupDatabaseAfterWrite();
        logInfo("db.symptoms", "delete");
      });
  }

  const values = {
    date: toEpochDay(symptoms.date),
    ...mapSymptomsKeys((key) => Number(symptoms[key])),
  };
  return db
    .insert(symptomsTable)
    .values(values)
    .onConflictDoUpdate({ target: symptomsTable.date, set: values })
    .then(() => {
      backupDatabaseAfterWrite();
      logInfo("db.symptoms", "upsert");
    });
}
