import { type FC, useEffect } from "react";

import { parseISO } from "date-fns";
import { useShallow } from "zustand/react/shallow";

import {
  markPillForDate,
  useEventsQuery,
} from "@/db/repositories/events-repository";
import { getMenstruationPredictions } from "@/domain/cycle-predictions";
import { compareTimesAsc, toCalendarDate } from "@/domain/time";
import { logError } from "@/logging/logger";
import { buildMenstruationSchedules } from "@/notifications/build-menstruation-schedules";
import { useSettingsStore } from "@/stores/settings-store";

import NativeReminders from "@modules/subcycle-reminders";

export const NotificationLifecycle: FC = () => {
  const { data: events } = useEventsQuery();
  const {
    menstruationNotifications,
    menstruationNotificationsEnabled,
    pillNotificationTimes,
    pillNotificationsEnabled,
    predictionTimespan,
  } = useSettingsStore(
    useShallow((state) => ({
      menstruationNotifications: state.settings.menstruationNotifications,
      menstruationNotificationsEnabled:
        state.settings.menstruationNotificationsEnabled,
      pillNotificationTimes: state.settings.pillNotificationTimes,
      pillNotificationsEnabled: state.settings.pillNotificationsEnabled,
      predictionTimespan: state.settings.predictionTimespan,
    })),
  );

  useEffect(() => {
    const subscription = NativeReminders.addListener(
      "reminderAction",
      (action) => {
        // The date is a local "yyyy-MM-dd" day, which `new Date` would read as UTC.
        if (action.type === "check-pill") {
          void markPillForDate(toCalendarDate(parseISO(action.date)));
        }
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const pillSchedules = pillNotificationsEnabled
      ? [...pillNotificationTimes].sort(compareTimesAsc).map((time, index) => ({
          id: `pill-${index}`,
          hour: time.hour,
          minute: time.minute,
        }))
      : [];
    const predictedMenstruationEvents = getMenstruationPredictions(
      events,
      predictionTimespan,
    );
    const menstruationSchedules = buildMenstruationSchedules(
      {
        menstruationNotifications,
        menstruationNotificationsEnabled,
      },
      predictedMenstruationEvents,
    );

    void Promise.all([
      NativeReminders.replacePillSchedules(pillSchedules),
      NativeReminders.replaceMenstruationSchedules(menstruationSchedules),
    ]).catch((error) => {
      logError("notification.lifecycle", "replace-schedules-failed", error, {
        menstruationScheduleCount: menstruationSchedules.length,
        pillScheduleCount: pillSchedules.length,
      });
    });
  }, [
    events,
    predictionTimespan,
    pillNotificationsEnabled,
    pillNotificationTimes,
    menstruationNotificationsEnabled,
    menstruationNotifications,
  ]);

  return null;
};
