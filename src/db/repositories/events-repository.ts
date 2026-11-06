import { eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { backupDatabaseAfterWrite } from "@/db/automatic-database-backup";
import { db } from "@/db/client";
import { eventsTable } from "@/db/schema";
import { fromEpochDay, toEpochDay } from "@/domain/time";
import { logInfo } from "@/logging/logger";
import { type Event, hasAnyEventFlags } from "@/types/event";

export function useEventsQuery(): { data: Event[]; error?: Error } {
  const query = useLiveQuery(
    db.select().from(eventsTable).orderBy(eventsTable.date),
  );

  return {
    data: query.data.flatMap((row) => {
      const date = fromEpochDay(row.date);
      if (!date) return [];
      return [
        {
          date,
          menstruationLight: Boolean(row.menstruationLight),
          menstruationModerate: Boolean(row.menstruationModerate),
          menstruationHeavy: Boolean(row.menstruationHeavy),
          menstruationSpotting: Boolean(row.menstruationSpotting),
          ovulation: Boolean(row.ovulation),
          pill: Boolean(row.pill),
          prediction: false,
        },
      ];
    }),
    error: query.error,
  };
}

export async function saveEvent(event: Event): Promise<void> {
  if (!hasAnyEventFlags(event)) {
    return db
      .delete(eventsTable)
      .where(eq(eventsTable.date, toEpochDay(event.date)))
      .then(() => {
        backupDatabaseAfterWrite();
        logInfo("db.event", "delete");
      });
  }

  const values = {
    date: toEpochDay(event.date),
    menstruationLight: Number(event.menstruationLight),
    menstruationModerate: Number(event.menstruationModerate),
    menstruationHeavy: Number(event.menstruationHeavy),
    menstruationSpotting: Number(event.menstruationSpotting),
    ovulation: Number(event.ovulation),
    pill: Number(event.pill),
  };
  return db
    .insert(eventsTable)
    .values(values)
    .onConflictDoUpdate({ target: eventsTable.date, set: values })
    .then(() => {
      backupDatabaseAfterWrite();
      logInfo("db.event", "upsert");
    });
}

export async function markPillForDate(date: Date): Promise<void> {
  return db
    .insert(eventsTable)
    .values({ date: toEpochDay(date), pill: 1 })
    .onConflictDoUpdate({ target: eventsTable.date, set: { pill: 1 } })
    .then(() => {
      backupDatabaseAfterWrite();
    });
}
