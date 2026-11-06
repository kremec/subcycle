export type Time = {
  hour: number;
  minute: number;
};

export function formatHourMinute(time: Time): string {
  return `${time.hour.toString().padStart(2, "0")}:${time.minute
    .toString()
    .padStart(2, "0")}`;
}

export function getCurrentTime(): Time {
  const now = new Date();
  return { hour: now.getHours(), minute: now.getMinutes() };
}

export function timeToDate(time: Time): Date {
  return new Date(1970, 0, 1, time.hour, time.minute);
}

export function compareTimesAsc(left: Time, right: Time): number {
  return left.hour - right.hour || left.minute - right.minute;
}
