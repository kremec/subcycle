import {
  addDays,
  addYears,
  compareAsc,
  differenceInCalendarDays,
  endOfMonth,
  startOfMonth,
} from "date-fns";

import { getPeriodHistory, type PeriodHistory } from "@/domain/cycle";
import { eventSchema, MenstruationFlow, type Event } from "@/types/event";

const flows = Object.values(MenstruationFlow);

function getPredictionCycles(
  history: PeriodHistory,
  throughDate: Date,
): number[] {
  const { periods, averageCycleLength } = history;
  if (!averageCycleLength) return [];

  const today = new Date();
  const lastStart = periods[periods.length - 1].start;
  const cycleLength = Math.round(averageCycleLength);
  const cycles = new Set<number>();

  // Keep upcoming summaries/reminders and the viewed month without generating the years between them.
  const ranges = [
    { start: startOfMonth(today), end: addYears(today, 1) },
    { start: startOfMonth(throughDate), end: endOfMonth(throughDate) },
  ];
  for (const range of ranges) {
    const first = Math.max(
      0,
      Math.floor(
        differenceInCalendarDays(range.start, lastStart) / cycleLength,
      ) - 1,
    );
    const last = Math.max(
      0,
      Math.ceil(differenceInCalendarDays(range.end, lastStart) / cycleLength),
    );
    for (let cycle = first; cycle <= last; cycle += 1) cycles.add(cycle);
  }
  return [...cycles].sort((left, right) => left - right);
}

export function getMenstruationPredictions(
  events: Event[],
  enabled: boolean,
  throughDate = new Date(),
): Event[] {
  if (!enabled) return [];
  const history = getPeriodHistory(events);
  return predictMenstruation(
    history,
    getPredictionCycles(history, throughDate),
  );
}

function predictMenstruation(
  history: PeriodHistory,
  cycles: number[],
): Event[] {
  const { periods, averageCycleLength, averagePeriodLength } = history;
  if (!averageCycleLength || !averagePeriodLength) {
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

  return cycles
    .filter((cycle) => cycle > 0)
    .flatMap((cycle) =>
      Array.from({ length: periodLength }, (_, day) => {
        const counts = flowCounts[day];
        const type = counts
          ? flows[counts.indexOf(Math.max(...counts))]
          : MenstruationFlow.MODERATE;

        return eventSchema.parse({
          date: addDays(lastStart, cycle * cycleLength + day),
          [type]: true,
          prediction: true,
        });
      }),
    );
}

function predictOvulation(
  events: Event[],
  history: PeriodHistory,
  cycles: number[],
): Event[] {
  const { periods, averageCycleLength } = history;
  if (!averageCycleLength) {
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
  const firstCycle = ovulationDates.some((date) => date >= lastStart) ? 1 : 0;

  // Ovulation in the current cycle may still be ahead of the last logged period.
  return cycles
    .filter((cycle) => cycle >= firstCycle)
    .map((cycle) =>
      eventSchema.parse({
        date: addDays(lastStart, cycle * cycleLength + ovulationDay),
        ovulation: true,
        prediction: true,
      }),
    );
}

export function getAllPredictions(
  events: Event[],
  enabled: boolean,
  throughDate = new Date(),
): Event[] {
  if (!enabled) return events;
  const history = getPeriodHistory(events);
  const cycles = getPredictionCycles(history, throughDate);
  return [
    ...events,
    ...predictMenstruation(history, cycles),
    ...predictOvulation(events, history, cycles),
  ];
}
