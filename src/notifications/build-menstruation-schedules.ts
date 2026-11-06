import { format, isFuture, parse, subDays } from "date-fns";

import { getEventPeriods } from "@/domain/cycle";
import { type Event } from "@/types/event";
import { type Settings } from "@/types/settings";

import type { MenstruationNotificationSchedule } from "@modules/subcycle-reminders";

type MenstruationReminderSettings = Pick<
  Settings,
  "menstruationNotifications" | "menstruationNotificationsEnabled"
>;

export function buildMenstruationSchedules(
  settings: MenstruationReminderSettings,
  predictedMenstruationEvents: Event[],
): MenstruationNotificationSchedule[] {
  if (!settings.menstruationNotificationsEnabled) {
    return [];
  }

  const predictedStarts = getEventPeriods(predictedMenstruationEvents).map(
    (period) => period.start,
  );

  return settings.menstruationNotifications
    .slice()
    .sort((left, right) => left.dayToMenstruation - right.dayToMenstruation)
    .flatMap((rule, index) => {
      const target = predictedStarts.find((menstruationStart) => {
        const candidate = subDays(menstruationStart, rule.dayToMenstruation);
        return isFuture(parse(rule.notificationTime, "HH:mm", candidate));
      });

      if (!target) {
        return [];
      }

      const scheduleDate = subDays(target, rule.dayToMenstruation);
      const [hour, minute] = rule.notificationTime.split(":").map(Number);

      return [
        {
          id: `menstruation-${index}`,
          date: format(scheduleDate, "yyyy-MM-dd"),
          hour,
          minute,
          daysBefore: rule.dayToMenstruation,
          customMessage: rule.customMessage,
        },
      ];
    });
}
