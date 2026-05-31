import { useCallback } from "react";

import NativeReminders from "@modules/subcycle-reminders";

export function useReminderPermissions() {
  return useCallback(async () => {
    let permissions = await NativeReminders.getPermissionsStatus();

    if (!permissions.granted) {
      await NativeReminders.requestPermissions();
      await new Promise((resolve) => {
        setTimeout(resolve, 400);
      });
      permissions = await NativeReminders.getPermissionsStatus();
    }

    const exactAlarmStatus = await NativeReminders.getExactAlarmStatus();

    if (exactAlarmStatus.available === false) {
      await NativeReminders.openExactAlarmSettings();
    }
  }, []);
}
