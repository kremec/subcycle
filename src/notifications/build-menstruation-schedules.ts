import { format, isFuture, set as setDateTime, subDays } from "date-fns";

import { getEventPeriods } from "@/domain/events/get-event-periods";
import { toCalendarDate } from "@/domain/time";
import {
  isMenstruationEvent,
  type Event,
  type Settings,
  type Time,
} from "@/types";

import type { MenstruationNotificationSchedule } from "@modules/subcycle-reminders";

type MenstruationReminderSettings = Pick<
  Settings,
  "menstruationNotifications" | "menstruationNotificationsEnabled"
>;

function isNotificationInFuture(date: Date, time: Time): boolean {
  return isFuture(
    setDateTime(date, {
      hours: time.hour,
      minutes: time.minute,
      seconds: 0,
      milliseconds: 0,
    }),
  );
}

export function buildMenstruationSchedules(
  settings: MenstruationReminderSettings,
  predictedMenstruationEvents: Event[],
): MenstruationNotificationSchedule[] {
  if (!settings.menstruationNotificationsEnabled) {
    return [];
  }

  const predictedStarts = getEventPeriods(
    predictedMenstruationEvents,
    isMenstruationEvent,
  ).map((period) => period.start);

  return settings.menstruationNotifications
    .slice()
    .sort((left, right) => left.dayToMenstruation - right.dayToMenstruation)
    .flatMap((rule, index) => {
      const target = predictedStarts.find((menstruationStart) => {
        const candidate = toCalendarDate(
          subDays(menstruationStart, rule.dayToMenstruation),
        );
        return isNotificationInFuture(candidate, rule.notificationTime);
      });

      if (!target) {
        return [];
      }

      const scheduleDate = toCalendarDate(
        subDays(target, rule.dayToMenstruation),
      );

      return [
        {
          id: `menstruation-${index}`,
          date: format(scheduleDate, "yyyy-MM-dd"),
          hour: rule.notificationTime.hour,
          minute: rule.notificationTime.minute,
          daysBefore: rule.dayToMenstruation,
          customMessage: rule.customMessage,
        },
      ];
    });
}
