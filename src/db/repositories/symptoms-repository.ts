import { eq } from "drizzle-orm";

import { backupDatabaseAfterWrite } from "@/db/automatic-database-backup";
import { db } from "@/db/client";
import { symptomsTable } from "@/db/schema";
import { useDatabaseQuery } from "@/db/use-database-query";
import { logInfo } from "@/logging/logger";
import { symptomsSchema, type Symptoms } from "@/types/symptom";

function symptomsQuery() {
  return db.select().from(symptomsTable).orderBy(symptomsTable.date);
}

export function useSymptomsQuery() {
  const query = useDatabaseQuery("symptoms", symptomsQuery);
  return { ...query, data: symptomsSchema.array().parse(query.data) };
}

export async function saveSymptoms(symptoms: Symptoms): Promise<void> {
  const { hasSymptoms, ...values } = symptoms;
  if (!hasSymptoms) {
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
    .values(values)
    .onConflictDoUpdate({ target: symptomsTable.date, set: values })
    .then(() => {
      backupDatabaseAfterWrite();
      logInfo("db.symptoms", "upsert");
    });
}
