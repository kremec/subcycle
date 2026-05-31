import { getAverageCycleLength } from "@/domain/stats/get-average-cycle-length";
import type { Event } from "@/types";

export function getMaxMenstruationNotificationDays(
  events: Event[],
): number | null {
  const average = getAverageCycleLength(events);
  if (!average) {
    return null;
  }

  return Math.max(1, Math.min(60, Math.round(average)));
}
