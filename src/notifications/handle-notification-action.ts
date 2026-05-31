import { markPillForDate } from "@/db/repositories/events-repository";
import { toCalendarDate } from "@/domain/time";

import type { ReminderAction } from "@modules/subcycle-reminders";

export async function handleNotificationAction(
  action: ReminderAction | null,
): Promise<void> {
  if (!action || action.type !== "check-pill") {
    return;
  }

  await markPillForDate(toCalendarDate(new Date(action.date)));
}
