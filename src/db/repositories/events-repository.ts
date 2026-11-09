import { eq, getTableColumns, sql } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { backupDatabaseAfterWrite } from "@/db/automatic-database-backup";
import { db } from "@/db/client";
import { eventsTable } from "@/db/schema";
import { logInfo } from "@/logging/logger";
import { type Event, type EventFlag, eventSchema } from "@/types/event";

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
  return eventSchema.array().parse(eventsQuery().all());
}

export function useEventsQuery() {
  const query = useLiveQuery(eventsQuery());
  return { ...query, data: eventSchema.array().parse(query.data) };
}

export async function toggleEventForDate(
  date: Date,
  key: EventFlag,
): Promise<void> {
  db.transaction((transaction) => {
    const existing = eventSchema.parse(
      transaction
        .select()
        .from(eventsTable)
        .where(eq(eventsTable.date, date))
        .get() ?? { date },
    );
    const event = eventSchema.parse({
      ...existing,
      ...(key !== "pill" && {
        menstruationLight: false,
        menstruationModerate: false,
        menstruationHeavy: false,
        menstruationSpotting: false,
        ovulation: false,
      }),
      [key]: !existing[key],
    });
    if (!event.hasFlags) {
      transaction.delete(eventsTable).where(eq(eventsTable.date, date)).run();
      return;
    }
    const values = {
      date,
      menstruationLight: event.menstruationLight,
      menstruationModerate: event.menstruationModerate,
      menstruationHeavy: event.menstruationHeavy,
      menstruationSpotting: event.menstruationSpotting,
      ovulation: event.ovulation,
      pill: event.pill,
    };
    transaction
      .insert(eventsTable)
      .values(values)
      .onConflictDoUpdate({ target: eventsTable.date, set: values })
      .run();
  });
  backupDatabaseAfterWrite();
  logInfo("db.event", "toggle", { key });
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
