import { addDays } from "date-fns";

import type { EventPeriod } from "@/domain/events/get-event-periods";

export function getPredictions(
  eventPeriods: EventPeriod[],
  predictionPeriod: number,
  averageEventCycleLength: number,
  averageEventPeriodLength: number,
): Date[] {
  if (eventPeriods.length === 0) {
    return [];
  }

  const predictedDates: Date[] = [];
  let lastEventPeriodStartDate = eventPeriods[eventPeriods.length - 1].start;

  for (
    let sequentialPrediction = 0;
    sequentialPrediction < predictionPeriod;
    sequentialPrediction += 1
  ) {
    lastEventPeriodStartDate = addDays(
      lastEventPeriodStartDate,
      Math.round(averageEventCycleLength),
    );

    for (
      let dayInPredictedPeriod = 0;
      dayInPredictedPeriod < Math.round(averageEventPeriodLength);
      dayInPredictedPeriod += 1
    ) {
      predictedDates.push(addDays(lastEventPeriodStartDate, dayInPredictedPeriod));
    }
  }

  return predictedDates;
}
