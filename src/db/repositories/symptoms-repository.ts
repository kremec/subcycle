import { eq } from "drizzle-orm";

import { backupDatabaseAfterWrite } from "@/db/automatic-database-backup";
import { db } from "@/db/client";
import { symptomsTable } from "@/db/schema";
import { useLiveRows } from "@/db/use-live-rows";
import { logInfo } from "@/logging/logger";
import { symptomsSchema, type Symptom } from "@/types/symptom";

export function useSymptomsQuery() {
  const query = useLiveRows("symptoms", () =>
    db.select().from(symptomsTable).orderBy(symptomsTable.date).all(),
  );
  return { ...query, data: symptomsSchema.array().parse(query.data) };
}

export async function toggleSymptomForDate(
  date: Date,
  key: Symptom,
  exclusiveWith: Symptom[],
): Promise<void> {
  db.transaction((transaction) => {
    const existing = symptomsSchema.parse(
      transaction
        .select()
        .from(symptomsTable)
        .where(eq(symptomsTable.date, date))
        .get() ?? { date },
    );
    const next = { ...existing, [key]: !existing[key] };
    if (next[key]) {
      for (const other of exclusiveWith) {
        if (other !== key) next[other] = false;
      }
    }
    const { hasSymptoms, ...values } = symptomsSchema.parse(next);
    if (!hasSymptoms) {
      transaction
        .delete(symptomsTable)
        .where(eq(symptomsTable.date, date))
        .run();
    } else {
      transaction
        .insert(symptomsTable)
        .values(values)
        .onConflictDoUpdate({ target: symptomsTable.date, set: values })
        .run();
    }
  });
  backupDatabaseAfterWrite();
  logInfo("db.symptoms", "toggle", { key });
}
