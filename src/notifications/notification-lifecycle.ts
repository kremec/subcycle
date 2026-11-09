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

import NativeReminders from "@modules/subcycle-reminders";

async function syncSchedules(): Promise<void> {
  try {
    const { settings } = useSettingsStore.getState();
    const pillSchedules = settings.pillNotificationsEnabled
      ? [...settings.pillNotificationTimes].sort().map((time, index) => {
          const [hour, minute] = time.split(":").map(Number);
          return { id: `pill-${index}`, hour, minute };
        })
      : [];
    const menstruationSchedules = buildMenstruationSchedules(
      settings,
      getMenstruationPredictions(getEvents(), settings.predictionsEnabled),
    );

    await Promise.all([
      NativeReminders.replacePillSchedules(pillSchedules),
      NativeReminders.replaceMenstruationSchedules(menstruationSchedules),
    ]);
  } catch (error) {
    logError("notification.lifecycle", "replace-schedules-failed", error);
  }
}

export function startNotificationLifecycle(): () => void {
  void syncSchedules();

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
    if (change.tableName === "events") void syncSchedules();
  });
  const unsubscribeSettings = useSettingsStore.subscribe((state, previous) => {
    const current = state.settings;
    const before = previous.settings;
    if (
      current.predictionsEnabled !== before.predictionsEnabled ||
      current.pillNotificationsEnabled !== before.pillNotificationsEnabled ||
      current.pillNotificationTimes !== before.pillNotificationTimes ||
      current.menstruationNotificationsEnabled !==
        before.menstruationNotificationsEnabled ||
      current.menstruationNotifications !== before.menstruationNotifications
    ) {
      void syncSchedules();
    }
  });

  return () => {
    actionSubscription.remove();
    databaseSubscription.remove();
    unsubscribeSettings();
  };
}
