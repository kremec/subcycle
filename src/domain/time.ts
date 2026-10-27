import { addDays, differenceInCalendarDays, set } from "date-fns";

import type { Time } from "@/types/time";

const UNIX_EPOCH = new Date(1970, 0, 1, 12, 0, 0, 0);

export function getCurrentTime(): Time {
  const now = new Date();
  return { hour: now.getHours(), minute: now.getMinutes() };
}

export function timeToDate(time: Time): Date {
  return new Date(1970, 0, 1, time.hour, time.minute, 0, 0);
}

export function compareTimesAsc(left: Time, right: Time): number {
  return left.hour - right.hour || left.minute - right.minute;
}

export function toCalendarDate(date: Date): Date {
  return set(date, { hours: 12, minutes: 0, seconds: 0, milliseconds: 0 });
}

export function toEpochDay(date: Date): number {
  return differenceInCalendarDays(date, UNIX_EPOCH);
}

// Older databases may store the day as text.
export function fromEpochDay(epochDay: number | string | null): Date | null {
  const day = Number(epochDay);
  return epochDay !== null && Number.isFinite(day)
    ? addDays(UNIX_EPOCH, day)
    : null;
}
