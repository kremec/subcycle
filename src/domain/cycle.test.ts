import { expect, test } from "bun:test";
import { addDays } from "date-fns";

import { getDayInCycle } from "@/domain/cycle";
import { withPredictions } from "@/domain/cycle-predictions";
import { fromEpochDay, toEpochDay } from "@/domain/time";
import { createDefaultEvent } from "@/types/event";

test("the first cycle day starts at midnight, before stored local noon", () => {
  const start = new Date(2026, 9, 25, 12);
  const events = [{ ...createDefaultEvent(start), menstruationModerate: true }];
  expect(getDayInCycle(new Date(2026, 9, 25, 0), events)).toBe(1);
  expect(getDayInCycle(new Date(2026, 9, 24, 23, 59), events)).toBeNull();
  expect(getDayInCycle(new Date(2026, 9, 26, 0), events)).toBe(2);
});

test("calendar-day storage survives daylight-saving boundaries and old text values", () => {
  for (const date of [new Date(2026, 2, 29, 12), new Date(2026, 9, 25, 12)]) {
    const day = toEpochDay(date);
    expect(fromEpochDay(day)).toEqual(date);
    expect(fromEpochDay(String(day))).toEqual(date);
    expect(toEpochDay(addDays(date, 1)) - day).toBe(1);
  }
  expect(fromEpochDay(null)).toBeNull();
  expect(fromEpochDay("invalid")).toBeNull();
});

test("predictions retain flow ties, zero-day ovulation and their input history", () => {
  const start = new Date(2026, 2, 1, 12);
  const events = [0, 28].map((offset, index) => ({
    ...createDefaultEvent(addDays(start, offset)),
    menstruationHeavy: index === 0,
    menstruationLight: index === 1,
    ovulation: true,
  }));
  const before = structuredClone(events);
  const predictions = withPredictions(events, 1).filter(
    (event) => event.prediction,
  );
  expect(predictions).toHaveLength(2);
  expect(predictions[0].date).toEqual(addDays(start, 56));
  expect(predictions[0].menstruationHeavy).toBe(true);
  expect(predictions[1].date).toEqual(addDays(start, 56));
  expect(predictions[1].ovulation).toBe(true);
  expect(events).toEqual(before);
  expect(withPredictions(events, 0)).toEqual(events);
});
