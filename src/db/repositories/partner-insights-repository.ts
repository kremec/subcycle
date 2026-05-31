import { eq } from "drizzle-orm";

import { db } from "@/db/client";
import { partnerInsightsTable } from "@/db/schema";
import { type PartnerInsight } from "@/types";

export async function upsertPartnerInsight(
  insight: PartnerInsight,
): Promise<void> {
  await db
    .insert(partnerInsightsTable)
    .values({
      dayInCycle: insight.dayInCycle,
      name: insight.name,
      description: insight.description,
    })
    .onConflictDoUpdate({
      target: partnerInsightsTable.dayInCycle,
      set: {
        name: insight.name,
        description: insight.description,
      },
    });
}

export async function deletePartnerInsight(dayInCycle: number): Promise<void> {
  await db
    .delete(partnerInsightsTable)
    .where(eq(partnerInsightsTable.dayInCycle, dayInCycle));
}

export async function replaceAllPartnerInsights(
  insights: PartnerInsight[],
): Promise<void> {
  await db.delete(partnerInsightsTable);
  for (const insight of insights) {
    await upsertPartnerInsight(insight);
  }
}
