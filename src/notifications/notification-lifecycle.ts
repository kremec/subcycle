import { Platform } from "react-native";

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

// Keep native replacements ordered even if the app lifecycle restarts.
let synchronization = Promise.resolve();

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

    // Free iOS queue capacity before replacing repeating pill requests.
    if (Platform.OS === "ios") {
      await NativeReminders.replaceMenstruationSchedules([]);
    }
    await NativeReminders.replacePillSchedules(pillSchedules);
    await NativeReminders.replaceMenstruationSchedules(
      Platform.OS === "ios"
        ? menstruationSchedules.slice(0, Math.max(0, 64 - pillSchedules.length))
        : menstruationSchedules,
    );
  } catch (error) {
    logError("notification.lifecycle", "replace-schedules-failed", error);
  }
}

export function startNotificationLifecycle(): () => void {
  let active = true;
  let queued = false;
  const synchronize = () => {
    if (queued) return;
    queued = true;
    synchronization = synchronization.then(async () => {
      queued = false;
      if (active) await syncSchedules();
    });
  };
  synchronize();
  let pending: ReturnType<typeof setTimeout> | undefined;
  const requestSync = () => {
    clearTimeout(pending);
    pending = setTimeout(() => {
      pending = undefined;
      synchronize();
    }, 0);
  };

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
    if (change.tableName === "events") requestSync();
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
      requestSync();
    }
  });

  return () => {
    active = false;
    clearTimeout(pending);
    actionSubscription.remove();
    databaseSubscription.remove();
    unsubscribeSettings();
  };
}
