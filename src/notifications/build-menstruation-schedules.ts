import { format, isFuture, parse, subDays } from "date-fns";

import { getEventPeriods } from "@/domain/cycle";
import { t } from "@/translation/use-translation";
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
    .flatMap((rule, index) =>
      predictedStarts.flatMap((menstruationStart) => {
        const scheduleDate = subDays(menstruationStart, rule.dayToMenstruation);
        if (!isFuture(parse(rule.notificationTime, "HH:mm", scheduleDate))) {
          return [];
        }

        const date = format(scheduleDate, "yyyy-MM-dd");
        const [hour, minute] = rule.notificationTime.split(":").map(Number);
        return [
          {
            id: `menstruation-${index}-${date}`,
            date,
            hour,
            minute,
            daysBefore: rule.dayToMenstruation,
            customMessage:
              rule.customMessage ??
              t("reminders.menstruationBody", {
                count: rule.dayToMenstruation,
              }),
          },
        ];
      }),
    )
    .sort(
      (left, right) =>
        left.date.localeCompare(right.date) ||
        left.hour - right.hour ||
        left.minute - right.minute,
    );
}
