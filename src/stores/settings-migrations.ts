import { type Settings } from "@/types/settings";

export function migrateSettings(saved: unknown, version: number) {
  const state = saved as { settings: Settings };

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

  return state;
}
