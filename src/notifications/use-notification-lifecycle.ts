import { useEffect } from "react";

import { syncAutomaticBackupSettings } from "@/db/automatic-database-backup";
import { useEventsQuery } from "@/db/queries/use-events-query";
import { getMenstruationPredictions } from "@/domain/predictions/get-menstruation-predictions";
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
    automaticBackupsEnabled,
    automaticBackupDirectoryUri,
  } = settings;

  useEffect(() => {
    void syncAutomaticBackupSettings();
  }, [automaticBackupsEnabled, automaticBackupDirectoryUri]);

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

    const replacePillSchedulesPromise =
      NativeReminders.replacePillSchedules(pillSchedules);
    const replaceMenstruationSchedulesPromise =
      NativeReminders.replaceMenstruationSchedules(menstruationSchedules);

    Promise.all([
      replacePillSchedulesPromise,
      replaceMenstruationSchedulesPromise,
    ]);
  }, [
    events,
    predictionTimespan,
    pillNotificationsEnabled,
    pillNotificationTimes,
    menstruationNotificationsEnabled,
    menstruationNotifications,
  ]);
}
