import { eq } from "drizzle-orm";

import { backupDatabaseAfterWrite } from "@/db/automatic-database-backup";
import { db } from "@/db/client";
import { partnerInsightsTable } from "@/db/schema";
import { useDatabaseQuery } from "@/db/use-database-query";
import { type PartnerInsight } from "@/types/partner-insight";

function partnerInsightsQuery() {
  return db
    .select()
    .from(partnerInsightsTable)
    .orderBy(partnerInsightsTable.dayInCycle);
}

export function usePartnerInsightsQuery() {
  return useDatabaseQuery("partner_insights", partnerInsightsQuery);
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
