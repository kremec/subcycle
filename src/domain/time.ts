import { addDays, compareAsc, differenceInCalendarDays, set } from "date-fns";

import type { Time } from "@/types";

const CALENDAR_DAY_TIME = {
  hours: 12,
  minutes: 0,
  seconds: 0,
  milliseconds: 0,
};
const UNIX_EPOCH = new Date(1970, 0, 1, 12, 0, 0, 0);

export function createTime(hour: number, minute: number): Time {
  return { hour, minute };
}

export function getCurrentTime(): Time {
  const now = new Date();
  return createTime(now.getHours(), now.getMinutes());
}

export function timeToDate(time: Time): Date {
  return new Date(1970, 0, 1, time.hour, time.minute, 0, 0);
}

export function compareTimesAsc(left: Time, right: Time): number {
  return compareAsc(timeToDate(left), timeToDate(right));
}

export function toCalendarDate(date: Date): Date {
  return set(date, CALENDAR_DAY_TIME);
}

export function toEpochDay(date: Date): number {
  return differenceInCalendarDays(toCalendarDate(date), UNIX_EPOCH);
}

export function fromEpochDay(epochDay: number): Date {
  return addDays(UNIX_EPOCH, epochDay);
}
