export type Time = {
  hour: number;
  minute: number;
};

export function formatHourMinute(time: Time): string {
  return `${time.hour.toString().padStart(2, "0")}:${time.minute
    .toString()
    .padStart(2, "0")}`;
}
