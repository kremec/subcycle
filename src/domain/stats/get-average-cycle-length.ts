import { differenceInCalendarDays } from "date-fns";

import { getEventPeriods } from "@/domain/events/get-event-periods";
import { isMenstruationEvent, type Event } from "@/types";

export function getAverageCycleLength(events: Event[]): number | null {
  const periods = getEventPeriods(events, isMenstruationEvent);
  if (periods.length < 2) {
    return null;
  }

  const lengths = periods
    .slice(1)
    .map((period, index) =>
      differenceInCalendarDays(period.start, periods[index].start),
    );

  return lengths.reduce((sum, value) => sum + value, 0) / lengths.length;
}
