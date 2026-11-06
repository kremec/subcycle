import { eq, getTableColumns, sql } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { backupDatabaseAfterWrite } from "@/db/automatic-database-backup";
import { db } from "@/db/client";
import { eventsTable } from "@/db/schema";
import { logInfo } from "@/logging/logger";
import { type Event, hasAnyEventFlags } from "@/types/event";

function eventsQuery() {
  return db
    .select({
      ...getTableColumns(eventsTable),
      prediction: sql<boolean>`0`.mapWith(Boolean),
    })
    .from(eventsTable)
    .orderBy(eventsTable.date);
}

export function getEvents(): Event[] {
  return eventsQuery().all();
}

export function useEventsQuery() {
  return useLiveQuery(eventsQuery());
}

export async function saveEvent(event: Event): Promise<void> {
  if (!hasAnyEventFlags(event)) {
    return db
      .delete(eventsTable)
      .where(eq(eventsTable.date, event.date))
      .then(() => {
        backupDatabaseAfterWrite();
        logInfo("db.event", "delete");
      });
  }

  const values = {
    date: event.date,
    menstruationLight: event.menstruationLight,
    menstruationModerate: event.menstruationModerate,
    menstruationHeavy: event.menstruationHeavy,
    menstruationSpotting: event.menstruationSpotting,
    ovulation: event.ovulation,
    pill: event.pill,
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
    .values({ date, pill: true })
    .onConflictDoUpdate({ target: eventsTable.date, set: { pill: true } })
    .then(() => {
      backupDatabaseAfterWrite();
    });
}
