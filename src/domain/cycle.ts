import { compareAsc, differenceInCalendarDays } from "date-fns";

import { isMenstruationEvent, type Event } from "@/types/event";

export type EventPeriod = {
  start: Date;
  end: Date;
};

export function getEventPeriods(
  events: Event[],
  eventFilter: (event: Event) => boolean,
): EventPeriod[] {
  const periods: EventPeriod[] = [];
  const dates = events
    .filter(eventFilter)
    .map((event) => event.date)
    .sort(compareAsc);

  for (const date of dates) {
    const last = periods.at(-1);
    if (last && differenceInCalendarDays(date, last.end) <= 1) {
      last.end = date;
    } else {
      periods.push({ start: date, end: date });
    }
  }

  return periods;
}

export function getDayInCycle(date: Date, events: Event[]): number | null {
  const start = getEventPeriods(events, isMenstruationEvent).findLast(
    (period) => differenceInCalendarDays(date, period.start) >= 0,
  )?.start;

  return start ? differenceInCalendarDays(date, start) + 1 : null;
}

export function getAverageCycleLength(events: Event[]): number | null {
  const periods = getEventPeriods(events, isMenstruationEvent);
  if (periods.length < 2) {
    return null;
  }

  return (
    differenceInCalendarDays(
      periods[periods.length - 1].start,
      periods[0].start,
    ) /
    (periods.length - 1)
  );
}

export function getAveragePeriodLength(
  events: Event[],
  eventFilter = isMenstruationEvent,
): number | null {
  const periods = getEventPeriods(events, eventFilter);
  if (periods.length === 0) return null;

  const totalDays = periods.reduce(
    (sum, period) =>
      sum + differenceInCalendarDays(period.end, period.start) + 1,
    0,
  );
  return totalDays / periods.length;
}
