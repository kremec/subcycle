import { asc } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { db } from "@/db/client";
import { mapPartnerInsightRowToPartnerInsight } from "@/db/mappers";
import { partnerInsightsTable } from "@/db/schema";
import type { PartnerInsight } from "@/types";

export function usePartnerInsightsQuery(): {
  data: PartnerInsight[];
  error?: Error;
} {
  const query = useLiveQuery(
    db
      .select()
      .from(partnerInsightsTable)
      .orderBy(asc(partnerInsightsTable.dayInCycle)),
  );

  return {
    data: query.data.map((row) => mapPartnerInsightRowToPartnerInsight(row)),
    error: query.error,
  };
}
