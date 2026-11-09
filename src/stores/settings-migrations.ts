import { type Settings } from "@/types/settings";

export function migrateSettings(saved: unknown, version: number) {
  const state = saved as {
    settings: Settings & { predictionTimespan?: number };
  };

  if (version < 1) {
    const { settings } = state;
    const time = (value: string | { hour: number; minute: number }) =>
      typeof value === "string"
        ? value
        : `${String(value.hour).padStart(2, "0")}:${String(value.minute).padStart(2, "0")}`;

    settings.pillNotificationTimes =
      settings.pillNotificationTimes?.map(time) ?? [];

    for (const rule of settings.menstruationNotifications ?? []) {
      rule.notificationTime = time(rule.notificationTime);
    }
  }

  if (version < 2) {
    const { settings } = state;
    settings.predictionsEnabled = (settings.predictionTimespan ?? 0) > 0;
    delete settings.predictionTimespan;
  }

  return state;
}
