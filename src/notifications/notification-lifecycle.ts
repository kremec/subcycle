import { addDatabaseChangeListener } from "expo-sqlite";

import { parseISO } from "date-fns";

import {
  getEvents,
  markPillForDate,
} from "@/db/repositories/events-repository";
import { getMenstruationPredictions } from "@/domain/cycle-predictions";
import { logError } from "@/logging/logger";
import { buildMenstruationSchedules } from "@/notifications/build-menstruation-schedules";
import { useSettingsStore } from "@/stores/settings-store";
import { compareTimesAsc } from "@/types/time";

import NativeReminders from "@modules/subcycle-reminders";

function syncSchedules(): void {
  const { settings } = useSettingsStore.getState();
  const pillSchedules = settings.pillNotificationsEnabled
    ? [...settings.pillNotificationTimes]
        .sort(compareTimesAsc)
        .map((time, index) => ({
          id: `pill-${index}`,
          hour: time.hour,
          minute: time.minute,
        }))
    : [];
  const menstruationSchedules = buildMenstruationSchedules(
    settings,
    getMenstruationPredictions(getEvents(), settings.predictionTimespan),
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
}

export function startNotificationLifecycle(): () => void {
  syncSchedules();

  const actionSubscription = NativeReminders.addListener(
    "reminderAction",
    (action) => {
      // Native writes use a separate connection. This write also refreshes live queries.
      if (action.type === "check-pill") {
        void markPillForDate(parseISO(action.date));
      }
    },
  );
  const databaseSubscription = addDatabaseChangeListener((change) => {
    if (change.tableName === "events") syncSchedules();
  });
  const unsubscribeSettings = useSettingsStore.subscribe((state, previous) => {
    const current = state.settings;
    const before = previous.settings;
    if (
      current.predictionTimespan !== before.predictionTimespan ||
      current.pillNotificationsEnabled !== before.pillNotificationsEnabled ||
      current.pillNotificationTimes !== before.pillNotificationTimes ||
      current.menstruationNotificationsEnabled !==
        before.menstruationNotificationsEnabled ||
      current.menstruationNotifications !== before.menstruationNotifications
    ) {
      syncSchedules();
    }
  });

  return () => {
    actionSubscription.remove();
    databaseSubscription.remove();
    unsubscribeSettings();
  };
}
