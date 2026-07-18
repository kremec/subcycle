import { logError, logInfo } from "@/logging/logger";

import NativeReminders from "@modules/subcycle-reminders";

export async function ensureReminderPermissions(): Promise<void> {
  try {
    let permissions = await NativeReminders.getPermissionsStatus();

    if (!permissions.granted) {
      logInfo("notification.permissions", "request-start");
      await NativeReminders.requestPermissions();
      await new Promise((resolve) => {
        setTimeout(resolve, 400);
      });
      permissions = await NativeReminders.getPermissionsStatus();
      logInfo("notification.permissions", "request-complete", {
        criticalAlertsEnabled: permissions.criticalAlertsEnabled ?? null,
        granted: permissions.granted,
        timeSensitiveEnabled: permissions.timeSensitiveEnabled ?? null,
      });
    }

    const exactAlarmStatus = await NativeReminders.getExactAlarmStatus();

    if (exactAlarmStatus.available === false) {
      logInfo("notification.permissions", "exact-alarm-settings-open");
      await NativeReminders.openExactAlarmSettings();
    }
  } catch (error) {
    logError(
      "notification.permissions",
      "ensure-failed",
      error instanceof Error ? error : String(error),
    );
    throw error;
  }
}
