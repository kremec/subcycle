import { addDays, compareAsc, differenceInCalendarDays } from "date-fns";

import { getPeriodHistory, type PeriodHistory } from "@/domain/cycle";
import { eventSchema, MenstruationFlow, type Event } from "@/types/event";

const flows = Object.values(MenstruationFlow);

export function getMenstruationPredictions(
  events: Event[],
  predictionTimespan: number,
): Event[] {
  return predictMenstruation(getPeriodHistory(events), predictionTimespan);
}

function predictMenstruation(
  history: PeriodHistory,
  predictionTimespan: number,
): Event[] {
  const { periods, averageCycleLength, averagePeriodLength } = history;
  if (predictionTimespan <= 0 || !averageCycleLength || !averagePeriodLength) {
    return [];
  }

  // Count each flow type by observation index within each period.
  const flowCounts: number[][] = [];
  for (const period of periods) {
    period.events.forEach((event, day) => {
      const counts = (flowCounts[day] ??= flows.map(() => 0));
      flows.forEach((type, index) => {
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
        ? flows[counts.indexOf(Math.max(...counts))]
        : MenstruationFlow.MODERATE;

      return eventSchema.parse({
        date: addDays(lastStart, cycle * cycleLength + day),
        [type]: true,
        prediction: true,
      });
    },
  );
}

function predictOvulation(
  events: Event[],
  history: PeriodHistory,
  predictionTimespan: number,
): Event[] {
  const { periods, averageCycleLength } = history;
  if (predictionTimespan <= 0 || !averageCycleLength) {
    return [];
  }

  const ovulationDates = events
    .filter((event) => event.ovulation)
    .map((event) => event.date)
    .sort(compareAsc);
  const ovulationOffsets = periods.slice(1).flatMap((next, index) => {
    const start = periods[index].start;
    const date = ovulationDates.find(
      (date) => date >= start && date < next.start,
    );
    return date ? [differenceInCalendarDays(date, start)] : [];
  });
  if (ovulationOffsets.length === 0) {
    return [];
  }

  const cycleLength = Math.round(averageCycleLength);
  const ovulationDay = Math.round(
    ovulationOffsets.reduce((sum, offset) => sum + offset, 0) /
      ovulationOffsets.length,
  );
  const lastStart = periods[periods.length - 1].start;

  // Ovulation in the current cycle may still be ahead of the last logged period.
  return Array.from({ length: predictionTimespan + 1 }, (_, index) =>
    eventSchema.parse({
      date: addDays(lastStart, index * cycleLength + ovulationDay),
      ovulation: true,
      prediction: true,
    }),
  );
}

export function getAllPredictions(
  events: Event[],
  predictionTimespan: number,
): Event[] {
  const history = getPeriodHistory(events);
  return [
    ...events,
    ...predictMenstruation(history, predictionTimespan),
    ...predictOvulation(events, history, predictionTimespan),
  ];
}
