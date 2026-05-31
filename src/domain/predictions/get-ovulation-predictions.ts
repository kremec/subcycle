import { compareAsc, differenceInCalendarDays } from "date-fns";

import { getEventPeriods } from "@/domain/events/get-event-periods";
import { getAverageCycleLength } from "@/domain/stats/get-average-cycle-length";
import {
  isMenstruationEvent,
  isOvulationEvent,
  type Event,
} from "@/types";

export function getOvulationPredictions(
  events: Event[],
  predictionPeriod: number,
): Event[] {
  if (predictionPeriod <= 0) {
    return [];
  }

  const menstruationPeriods = getEventPeriods(events, isMenstruationEvent);
  if (menstruationPeriods.length === 0) {
    return [];
  }

  const offsets: number[] = [];
  for (let index = 0; index < menstruationPeriods.length - 1; index += 1) {
    const currentPeriodStart = menstruationPeriods[index].start;
    const nextPeriodStart = menstruationPeriods[index + 1].start;

    const ovulationEvent = events
      .filter(
        (event) =>
          isOvulationEvent(event) &&
          event.date.getTime() >= currentPeriodStart.getTime() &&
          event.date.getTime() < nextPeriodStart.getTime(),
      )
      .sort((left, right) => compareAsc(left.date, right.date))[0];

    if (ovulationEvent) {
      offsets.push(differenceInCalendarDays(ovulationEvent.date, currentPeriodStart));
    }
  }

  if (offsets.length === 0) {
    return [];
  }

  const averageOffset =
    offsets.reduce((sum, value) => sum + value, 0) / offsets.length;
  const averageCycleLength = getAverageCycleLength(events);

  if (!averageCycleLength) {
    return [];
  }

  const predicted: Event[] = [];
  let lastCycleStart = menstruationPeriods[menstruationPeriods.length - 1].start;
  for (let index = 0; index < predictionPeriod; index += 1) {
    lastCycleStart = new Date(
      lastCycleStart.getFullYear(),
      lastCycleStart.getMonth(),
      lastCycleStart.getDate() + Math.round(averageCycleLength),
      12,
    );
    const ovulationDate = new Date(
      lastCycleStart.getFullYear(),
      lastCycleStart.getMonth(),
      lastCycleStart.getDate() + Math.round(averageOffset),
      12,
    );

    predicted.push({
      date: ovulationDate,
      menstruationLight: false,
      menstruationModerate: false,
      menstruationHeavy: false,
      menstruationSpotting: false,
      ovulation: true,
      pill: false,
      prediction: true,
    });
  }

  return predicted;
}
