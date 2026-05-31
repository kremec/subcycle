import { compareAsc, differenceInCalendarDays } from "date-fns";

import type { Event } from "@/types";

export type EventPeriod = {
  start: Date;
  end: Date;
};

export function getEventPeriods(
  events: Event[],
  eventFilter: (event: Event) => boolean,
): EventPeriod[] {
  const filteredEvents = events
    .filter(eventFilter)
    .sort((left, right) => compareAsc(left.date, right.date));

  if (filteredEvents.length === 0) {
    return [];
  }

  const periods: EventPeriod[] = [];
  let periodStart = filteredEvents[0].date;
  let lastDate = periodStart;

  for (const event of filteredEvents) {
    const currentDate = event.date;
    const daysBetween = differenceInCalendarDays(currentDate, lastDate);

    if (daysBetween > 1) {
      periods.push({ start: periodStart, end: lastDate });
      periodStart = currentDate;
    }

    lastDate = currentDate;
  }

  periods.push({ start: periodStart, end: lastDate });
  return periods;
}
