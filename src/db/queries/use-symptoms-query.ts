import { asc } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { db } from "@/db/client";
import { mapSymptomsRowToSymptoms } from "@/db/mappers";
import { symptomsTable } from "@/db/schema";
import type { Symptoms } from "@/types";

export function useSymptomsQuery(): { data: Symptoms[]; error?: Error } {
  const query = useLiveQuery(
    db.select().from(symptomsTable).orderBy(asc(symptomsTable.date)),
  );

  return {
    data: query.data.map((row) => mapSymptomsRowToSymptoms(row)),
    error: query.error,
  };
}
