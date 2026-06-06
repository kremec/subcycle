import { asc } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { db } from "@/db/client";
import { mapEventRowToEvent } from "@/db/mappers";
import { eventsTable } from "@/db/schema";
import type { Event } from "@/types";

export function useEventsQuery(): { data: Event[]; error?: Error } {
  const query = useLiveQuery(
    db.select().from(eventsTable).orderBy(asc(eventsTable.date)),
  );

  return {
    data: query.data
      .map((row) => mapEventRowToEvent(row))
      .filter((event): event is Event => event !== null),
    error: query.error,
  };
}
