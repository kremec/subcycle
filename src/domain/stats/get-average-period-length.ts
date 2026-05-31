import { differenceInCalendarDays } from "date-fns";

import { getEventPeriods } from "@/domain/events/get-event-periods";
import { isMenstruationEvent, type Event } from "@/types";

export function getAveragePeriodLength(events: Event[]): number | null {
  const periods = getEventPeriods(events, isMenstruationEvent);
  if (periods.length === 0) {
    return null;
  }

  const lengths = periods.map(
    (period) => differenceInCalendarDays(period.end, period.start) + 1,
  );

  return lengths.reduce((sum, value) => sum + value, 0) / lengths.length;
}
