import { eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { backupDatabaseAfterWrite } from "@/db/automatic-database-backup";
import { db } from "@/db/client";
import { partnerInsightsTable } from "@/db/schema";
import { type PartnerInsight } from "@/types/partner-insight";

export function usePartnerInsightsQuery(): {
  data: PartnerInsight[];
  error?: Error;
} {
  return useLiveQuery(
    db
      .select()
      .from(partnerInsightsTable)
      .orderBy(partnerInsightsTable.dayInCycle),
  );
}

export async function savePartnerInsight(
  insight: PartnerInsight,
  previousDayInCycle?: number,
): Promise<void> {
  const query =
    previousDayInCycle === undefined
      ? db.insert(partnerInsightsTable).values(insight)
      : db
          .update(partnerInsightsTable)
          .set(insight)
          .where(eq(partnerInsightsTable.dayInCycle, previousDayInCycle));

  return query.then(() => {
    backupDatabaseAfterWrite();
  });
}

export async function deletePartnerInsight(dayInCycle: number): Promise<void> {
  return db
    .delete(partnerInsightsTable)
    .where(eq(partnerInsightsTable.dayInCycle, dayInCycle))
    .then(() => {
      backupDatabaseAfterWrite();
    });
}
