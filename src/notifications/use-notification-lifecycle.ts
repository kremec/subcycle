import { useEffect } from "react";

import { useEventsQuery } from "@/db/queries/use-events-query";
import { getMenstruationPredictions } from "@/domain/predictions/get-menstruation-predictions";
import { logError } from "@/logging/logger";
import { buildMenstruationSchedules } from "@/notifications/build-menstruation-schedules";
import { buildPillSchedules } from "@/notifications/build-pill-schedules";
import { handleNotificationAction } from "@/notifications/handle-notification-action";
import { useSettingsStore } from "@/stores/settings-store";

import NativeReminders from "@modules/subcycle-reminders";

export function useNotificationLifecycle() {
  const { data: events } = useEventsQuery();
  const { settings } = useSettingsStore();
  const {
    menstruationNotifications,
    menstruationNotificationsEnabled,
    pillNotificationTimes,
    pillNotificationsEnabled,
    predictionTimespan,
  } = settings;

  useEffect(() => {
    const subscription = NativeReminders.addListener(
      "reminderAction",
      (action) => {
        void handleNotificationAction(action);
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const pillSchedules = buildPillSchedules({
      pillNotificationTimes,
      pillNotificationsEnabled,
    });
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
      logError(
        "notification.lifecycle",
        "replace-schedules-failed",
        error instanceof Error ? error : String(error),
        {
          menstruationScheduleCount: menstruationSchedules.length,
          pillScheduleCount: pillSchedules.length,
        },
      );
    });
  }, [
    events,
    predictionTimespan,
    pillNotificationsEnabled,
    pillNotificationTimes,
    menstruationNotificationsEnabled,
    menstruationNotifications,
  ]);
}
