import { compareAsc } from "date-fns";

import type { EventPeriod } from "@/domain/events/get-event-periods";
import type { Event } from "@/types";

export type MenstruationType = "light" | "moderate" | "heavy" | "spotting";

export type MenstruationDayPattern = {
  dayOfPeriod: number;
  lightCount: number;
  moderateCount: number;
  heavyCount: number;
  spottingCount: number;
};

function getMostLikelyType(pattern: MenstruationDayPattern): MenstruationType {
  const maxCount = Math.max(
    pattern.heavyCount,
    pattern.moderateCount,
    pattern.lightCount,
    pattern.spottingCount,
  );

  if (maxCount === pattern.heavyCount) return "heavy";
  if (maxCount === pattern.moderateCount) return "moderate";
  if (maxCount === pattern.lightCount) return "light";
  return "spotting";
}

export function analyzeMenstruationDayPatterns(
  events: Event[],
  menstruationPeriods: EventPeriod[],
): Map<number, MenstruationType> {
  const dayPatterns = new Map<number, MenstruationDayPattern>();

  for (const period of menstruationPeriods) {
    const periodEvents = events
      .filter(
        (event) =>
          event.date.getTime() >= period.start.getTime() &&
          event.date.getTime() <= period.end.getTime() &&
          (event.menstruationLight ||
            event.menstruationModerate ||
            event.menstruationHeavy ||
            event.menstruationSpotting),
      )
      .sort((left, right) => compareAsc(left.date, right.date));

    periodEvents.forEach((event, index) => {
      const dayOfPeriod = index + 1;
      const current =
        dayPatterns.get(dayOfPeriod) ??
        ({
          dayOfPeriod,
          lightCount: 0,
          moderateCount: 0,
          heavyCount: 0,
          spottingCount: 0,
        } satisfies MenstruationDayPattern);

      if (event.menstruationLight) current.lightCount += 1;
      if (event.menstruationModerate) current.moderateCount += 1;
      if (event.menstruationHeavy) current.heavyCount += 1;
      if (event.menstruationSpotting) current.spottingCount += 1;

      dayPatterns.set(dayOfPeriod, current);
    });
  }

  return new Map(
    Array.from(dayPatterns.entries()).map(([day, pattern]) => [
      day,
      getMostLikelyType(pattern),
    ]),
  );
}
