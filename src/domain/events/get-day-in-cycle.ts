import { compareAsc, differenceInCalendarDays } from "date-fns";

import { getEventPeriods } from "@/domain/events/get-event-periods";
import { isMenstruationEvent, type Event } from "@/types";

export function getDayInCycle(date: Date, events: Event[]): number | null {
  const menstruationPeriods = getEventPeriods(events, isMenstruationEvent);
  const periodsBeforeDate = menstruationPeriods
    .filter((period) => period.start.getTime() <= date.getTime())
    .sort((left, right) => compareAsc(right.start, left.start));

  if (periodsBeforeDate.length === 0) {
    return null;
  }

  return differenceInCalendarDays(date, periodsBeforeDate[0].start) + 1;
}
