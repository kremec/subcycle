import { compareAsc, differenceInCalendarDays, format } from "date-fns";

import { EventKind, type Event } from "@/types/event";

export type EventPeriod = {
  start: Date;
  end: Date;
};

export type PeriodHistory = {
  periods: (EventPeriod & { events: Event[] })[];
  averageCycleLength: number | null;
  averagePeriodLength: number | null;
};

export function getVisibleCycleEvents(events: Event[]): Event[] {
  const visible = new Map<string, Event>();
  for (const event of events) {
    if (event.prediction && event.kind !== EventKind.NONE) {
      visible.set(format(event.date, "yyyy-MM-dd"), event);
    }
  }
  for (const event of events) {
    if (!event.prediction && event.kind !== EventKind.NONE) {
      visible.set(format(event.date, "yyyy-MM-dd"), event);
    }
  }
  return [...visible.values()].sort((left, right) =>
    compareAsc(left.date, right.date),
  );
}

export function getPeriodHistory(
  events: Event[],
  eventFilter = (event: Event) => event.kind === EventKind.MENSTRUATION,
): PeriodHistory {
  const periods: PeriodHistory["periods"] = [];
  const observations = events
    .filter(eventFilter)
    .sort((left, right) => compareAsc(left.date, right.date));

  for (const event of observations) {
    const { date } = event;
    const last = periods.at(-1);
    if (last && differenceInCalendarDays(date, last.end) <= 1) {
      last.end = date;
      last.events.push(event);
    } else {
      periods.push({ start: date, end: date, events: [event] });
    }
  }

  const totalDays = periods.reduce(
    (sum, period) =>
      sum + differenceInCalendarDays(period.end, period.start) + 1,
    0,
  );

  return {
    periods,
    averageCycleLength:
      periods.length < 2
        ? null
        : differenceInCalendarDays(
            periods[periods.length - 1].start,
            periods[0].start,
          ) /
          (periods.length - 1),
    averagePeriodLength:
      periods.length === 0 ? null : totalDays / periods.length,
  };
}

export function getEventPeriods(
  events: Event[],
  eventFilter?: (event: Event) => boolean,
): EventPeriod[] {
  return getPeriodHistory(events, eventFilter).periods.map((period) => ({
    start: period.start,
    end: period.end,
  }));
}

export function getDayInCycle(date: Date, events: Event[]): number | null {
  const start = getPeriodHistory(events).periods.findLast(
    (period) => differenceInCalendarDays(date, period.start) >= 0,
  )?.start;

  return start ? differenceInCalendarDays(date, start) + 1 : null;
}

export function getAverageCycleLength(events: Event[]): number | null {
  return getPeriodHistory(events).averageCycleLength;
}
