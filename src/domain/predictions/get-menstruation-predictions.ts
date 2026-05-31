import { getEventPeriods } from "@/domain/events/get-event-periods";
import { analyzeMenstruationDayPatterns } from "@/domain/predictions/analyze-menstruation-day-patterns";
import { getPredictions } from "@/domain/predictions/get-predictions";
import { getAverageCycleLength } from "@/domain/stats/get-average-cycle-length";
import { getAveragePeriodLength } from "@/domain/stats/get-average-period-length";
import { isMenstruationEvent, type Event } from "@/types";

export function getMenstruationPredictions(
  events: Event[],
  predictionPeriod: number,
): Event[] {
  if (predictionPeriod <= 0) {
    return [];
  }

  const menstruationPeriods = getEventPeriods(events, isMenstruationEvent);
  const averageCycleLength = getAverageCycleLength(events);
  const averagePeriodLength = getAveragePeriodLength(events);

  if (!averageCycleLength || !averagePeriodLength) {
    return [];
  }

  const dayPatterns = analyzeMenstruationDayPatterns(
    events,
    menstruationPeriods,
  );
  const predictedDates = getPredictions(
    menstruationPeriods,
    predictionPeriod,
    averageCycleLength,
    averagePeriodLength,
  );

  return predictedDates.map((date, index) => {
    const dayOfPeriod = (index % Math.round(averagePeriodLength)) + 1;
    const type = dayPatterns.get(dayOfPeriod) ?? "moderate";

    return {
      date,
      menstruationLight: type === "light",
      menstruationModerate: type === "moderate",
      menstruationHeavy: type === "heavy",
      menstruationSpotting: type === "spotting",
      ovulation: false,
      pill: false,
      prediction: true,
    };
  });
}
