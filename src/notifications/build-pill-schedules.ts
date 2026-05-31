import { compareTimesAsc } from "@/domain/time";
import type { Settings } from "@/types";

import type { PillNotificationSchedule } from "@modules/subcycle-reminders";

type PillReminderSettings = Pick<
  Settings,
  "pillNotificationTimes" | "pillNotificationsEnabled"
>;

export function buildPillSchedules(
  settings: PillReminderSettings,
): PillNotificationSchedule[] {
  if (!settings.pillNotificationsEnabled) {
    return [];
  }

  return settings.pillNotificationTimes
    .slice()
    .sort(compareTimesAsc)
    .map((time, index) => ({
      id: `pill-${index}`,
      hour: time.hour,
      minute: time.minute,
    }));
}
