import { differenceInCalendarDays, set } from "date-fns";
import { eq } from "drizzle-orm";

import { backupDatabaseAfterWrite } from "@/db/automatic-database-backup";
import { db } from "@/db/client";
import { mapSymptomsToRow } from "@/db/mappers";
import { symptomsTable } from "@/db/schema";
import { hasAnySymptoms, type Symptoms } from "@/types";

const UNIX_EPOCH = new Date(1970, 0, 1, 12, 0, 0, 0);

function toEpochDay(date: Date): number {
  return differenceInCalendarDays(
    set(date, { hours: 12, minutes: 0, seconds: 0, milliseconds: 0 }),
    UNIX_EPOCH,
  );
}

export async function upsertSymptoms(symptoms: Symptoms): Promise<void> {
  if (!hasAnySymptoms(symptoms)) {
    await deleteSymptomsByDate(symptoms.date);
    return;
  }

  const values = mapSymptomsToRow(symptoms);
  await db
    .insert(symptomsTable)
    .values(values)
    .onConflictDoUpdate({
      target: symptomsTable.date,
      set: values,
    });
  backupDatabaseAfterWrite();
}

export async function deleteSymptomsByDate(date: Date): Promise<void> {
  await db.delete(symptomsTable).where(eq(symptomsTable.date, toEpochDay(date)));
  backupDatabaseAfterWrite();
}

export async function replaceAllSymptoms(symptomsList: Symptoms[]): Promise<void> {
  await db.delete(symptomsTable);
  for (const symptoms of symptomsList) {
    await upsertSymptoms(symptoms);
  }
  backupDatabaseAfterWrite();
}
