import { differenceInCalendarDays, set } from "date-fns";
import { eq } from "drizzle-orm";

import { backupDatabaseAfterWrite } from "@/db/automatic-database-backup";
import { db } from "@/db/client";
import { mapSymptomsToRow } from "@/db/mappers";
import { symptomsTable } from "@/db/schema";
import { logError, logInfo } from "@/logging/logger";
import { hasAnySymptoms, type Symptoms } from "@/types";

const UNIX_EPOCH = new Date(1970, 0, 1, 12, 0, 0, 0);

function toEpochDay(date: Date): number {
  return differenceInCalendarDays(
    set(date, { hours: 12, minutes: 0, seconds: 0, milliseconds: 0 }),
    UNIX_EPOCH,
  );
}

async function saveSymptoms(symptoms: Symptoms): Promise<void> {
  const values = mapSymptomsToRow(symptoms);
  await db.insert(symptomsTable).values(values).onConflictDoUpdate({
    target: symptomsTable.date,
    set: values,
  });
  backupDatabaseAfterWrite();
}

export async function upsertSymptoms(symptoms: Symptoms): Promise<void> {
  if (!hasAnySymptoms(symptoms)) {
    await deleteSymptomsByDate(symptoms.date);
    return;
  }

  try {
    await saveSymptoms(symptoms);
    logInfo("db.symptoms", "upsert");
  } catch (error) {
    logError(
      "db.symptoms",
      "upsert-failed",
      error instanceof Error ? error : String(error),
    );
    throw error;
  }
}

export async function deleteSymptomsByDate(date: Date): Promise<void> {
  try {
    await db
      .delete(symptomsTable)
      .where(eq(symptomsTable.date, toEpochDay(date)));
    backupDatabaseAfterWrite();
    logInfo("db.symptoms", "delete");
  } catch (error) {
    logError(
      "db.symptoms",
      "delete-failed",
      error instanceof Error ? error : String(error),
    );
    throw error;
  }
}

export async function replaceAllSymptoms(
  symptomsList: Symptoms[],
): Promise<void> {
  try {
    await db.delete(symptomsTable);
    for (const symptoms of symptomsList) {
      if (hasAnySymptoms(symptoms)) {
        await saveSymptoms(symptoms);
      }
    }
    backupDatabaseAfterWrite();
    logInfo("db.symptoms", "replace-all", { count: symptomsList.length });
  } catch (error) {
    logError(
      "db.symptoms",
      "replace-all-failed",
      error instanceof Error ? error : String(error),
      { count: symptomsList.length },
    );
    throw error;
  }
}
