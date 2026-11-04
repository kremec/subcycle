import { addDays, compareAsc, differenceInCalendarDays } from "date-fns";

import {
  getAverageCycleLength,
  getAveragePeriodLength,
  getEventPeriods,
} from "@/domain/cycle";
import {
  createDefaultEvent,
  isMenstruationEvent,
  type Event,
} from "@/types/event";

const flowTypes = [
  "menstruationHeavy",
  "menstruationModerate",
  "menstruationLight",
  "menstruationSpotting",
] as const;

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
  const flowCounts: number[][] = [];
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
        const counts = (flowCounts[day] ??= [0, 0, 0, 0]);
        flowTypes.forEach((type, index) => {
          if (event[type]) counts[index] += 1;
        });
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
      const counts = flowCounts[day];
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

function getOvulationPredictions(
  events: Event[],
  predictionTimespan: number,
): Event[] {
  const periods = getEventPeriods(events, isMenstruationEvent);
  const ovulationOffsets = periods.slice(1).flatMap((next, index) => {
    const start = periods[index].start;
    const offsets = events
      .filter(
        (event) =>
          event.ovulation && event.date >= start && event.date < next.start,
      )
      .map((event) => differenceInCalendarDays(event.date, start));
    return offsets.length === 0 ? [] : [Math.min(...offsets)];
  });
  const averageCycleLength = getAverageCycleLength(events);
  if (
    predictionTimespan <= 0 ||
    ovulationOffsets.length === 0 ||
    !averageCycleLength
  ) {
    return [];
  }

  const cycleLength = Math.round(averageCycleLength);
  const ovulationDay = Math.round(
    ovulationOffsets.reduce((sum, offset) => sum + offset, 0) /
      ovulationOffsets.length,
  );
  const lastStart = periods[periods.length - 1].start;

  return Array.from({ length: predictionTimespan }, (_, index) => ({
    ...createDefaultEvent(
      addDays(lastStart, (index + 1) * cycleLength + ovulationDay),
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
