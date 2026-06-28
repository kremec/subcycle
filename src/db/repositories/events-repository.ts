import { differenceInCalendarDays, set } from "date-fns";
import { eq } from "drizzle-orm";

import { backupDatabaseAfterWrite } from "@/db/automatic-database-backup";
import { db } from "@/db/client";
import { mapEventToRow } from "@/db/mappers";
import { eventsTable } from "@/db/schema";
import { type Event, hasAnyEventFlags } from "@/types";

const UNIX_EPOCH = new Date(1970, 0, 1, 12, 0, 0, 0);

function toEpochDay(date: Date): number {
  return differenceInCalendarDays(
    set(date, { hours: 12, minutes: 0, seconds: 0, milliseconds: 0 }),
    UNIX_EPOCH,
  );
}

export async function upsertEvent(event: Event): Promise<void> {
  if (!hasAnyEventFlags(event)) {
    await deleteEventByDate(event.date);
    return;
  }

  const values = mapEventToRow(event);
  await db
    .insert(eventsTable)
    .values(values)
    .onConflictDoUpdate({
      target: eventsTable.date,
      set: values,
    });
  backupDatabaseAfterWrite();
}

export async function deleteEventByDate(date: Date): Promise<void> {
  await db.delete(eventsTable).where(eq(eventsTable.date, toEpochDay(date)));
  backupDatabaseAfterWrite();
}

export async function markPillForDate(date: Date): Promise<void> {
  const epochDay = toEpochDay(date);
  const current = await db
    .select()
    .from(eventsTable)
    .where(eq(eventsTable.date, epochDay))
    .limit(1);

  const event = current[0];
  const values = {
    date: epochDay,
    menstruationLight: event?.menstruationLight ?? 0,
    menstruationModerate: event?.menstruationModerate ?? 0,
    menstruationHeavy: event?.menstruationHeavy ?? 0,
    menstruationSpotting: event?.menstruationSpotting ?? 0,
    ovulation: event?.ovulation ?? 0,
    pill: 1,
  };

  await db
    .insert(eventsTable)
    .values(values)
    .onConflictDoUpdate({ target: eventsTable.date, set: values });
  backupDatabaseAfterWrite();
}

export async function replaceAllEvents(events: Event[]): Promise<void> {
  await db.delete(eventsTable);
  for (const event of events) {
    await upsertEvent(event);
  }
  backupDatabaseAfterWrite();
}
