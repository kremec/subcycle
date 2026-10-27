import { addDays, compareAsc, differenceInCalendarDays } from "date-fns";

import {
  createDefaultEvent,
  isMenstruationEvent,
  type Event,
} from "@/types/event";

export type EventPeriod = {
  start: Date;
  end: Date;
};

const flowTypes = [
  "menstruationHeavy",
  "menstruationModerate",
  "menstruationLight",
  "menstruationSpotting",
] as const;

function average(values: number[]): number | null {
  return values.length === 0
    ? null
    : values.reduce((sum, value) => sum + value, 0) / values.length;
}

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
  return average(
    getEventPeriods(events, eventFilter).map(
      (period) => differenceInCalendarDays(period.end, period.start) + 1,
    ),
  );
}

export function getMenstruationPredictions(
  events: Event[],
  predictionTimespan: number,
): Event[] {
  const averageCycleLength = getAverageCycleLength(events);
  const averagePeriodLength = getAveragePeriodLength(events);
  if (predictionTimespan <= 0 || !averageCycleLength || !averagePeriodLength) {
    return [];
  }

  // Count each flow type per day of period, to predict the most common one.
  const periods = getEventPeriods(events, isMenstruationEvent);
  const flowCounts = new Map<number, number[]>();
  for (const period of periods) {
    events
      .filter(
        (event) =>
          isMenstruationEvent(event) &&
          event.date >= period.start &&
          event.date <= period.end,
      )
      .sort((left, right) => compareAsc(left.date, right.date))
      .forEach((event, day) => {
        const counts = flowCounts.get(day) ?? [0, 0, 0, 0];
        flowTypes.forEach((type, index) => {
          if (event[type]) counts[index] += 1;
        });
        flowCounts.set(day, counts);
      });
  }

  const cycleLength = Math.round(averageCycleLength);
  const periodLength = Math.round(averagePeriodLength);
  const lastStart = periods[periods.length - 1].start;

  return Array.from(
    { length: predictionTimespan * periodLength },
    (_, index) => {
      const cycle = Math.floor(index / periodLength) + 1;
      const day = index % periodLength;
      const counts = flowCounts.get(day);
      const type = counts
        ? flowTypes[counts.indexOf(Math.max(...counts))]
        : "menstruationModerate";

      return {
        ...createDefaultEvent(addDays(lastStart, cycle * cycleLength + day)),
        [type]: true,
        prediction: true,
      };
    },
  );
}

export function getOvulationPredictions(
  events: Event[],
  predictionTimespan: number,
): Event[] {
  const periods = getEventPeriods(events, isMenstruationEvent);
  const averageOffset = average(
    periods.slice(1).flatMap((next, index) => {
      const start = periods[index].start;
      const offsets = events
        .filter(
          (event) =>
            event.ovulation && event.date >= start && event.date < next.start,
        )
        .map((event) => differenceInCalendarDays(event.date, start));
      return offsets.length === 0 ? [] : [Math.min(...offsets)];
    }),
  );
  const averageCycleLength = getAverageCycleLength(events);
  if (
    predictionTimespan <= 0 ||
    averageOffset === null ||
    !averageCycleLength
  ) {
    return [];
  }

  const cycleLength = Math.round(averageCycleLength);
  const lastStart = periods[periods.length - 1].start;

  return Array.from({ length: predictionTimespan }, (_, index) => ({
    ...createDefaultEvent(
      addDays(lastStart, (index + 1) * cycleLength + Math.round(averageOffset)),
    ),
    ovulation: true,
    prediction: true,
  }));
}

export function withPredictions(
  events: Event[],
  predictionTimespan: number,
): Event[] {
  return [
    ...events,
    ...getMenstruationPredictions(events, predictionTimespan),
    ...getOvulationPredictions(events, predictionTimespan),
  ];
}
