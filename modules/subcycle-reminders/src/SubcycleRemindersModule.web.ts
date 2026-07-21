import { NativeModule } from "expo";
import { Paths } from "expo-file-system";

import type {
  BatteryOptimizationStatus,
  ExactAlarmStatus,
  MenstruationNotificationSchedule,
  PillNotificationSchedule,
  ReminderPermissionStatus,
  SubcycleRemindersModuleEvents,
} from "./SubcycleReminders.types";

class SubcycleRemindersModule extends NativeModule<SubcycleRemindersModuleEvents> {
  async appendDebugLog(_line: string): Promise<void> {}

  async getBackupDirectoryUri(): Promise<string> {
    return Paths.join(Paths.document, "backups");
  }

  async getPermissionsStatus(): Promise<ReminderPermissionStatus> {
    return { granted: false };
  }

  async requestPermissions(): Promise<ReminderPermissionStatus> {
    return { granted: false };
  }

  async getExactAlarmStatus(): Promise<ExactAlarmStatus> {
    return { available: null };
  }

  async openExactAlarmSettings(): Promise<void> {}

  async getBatteryOptimizationStatus(): Promise<BatteryOptimizationStatus> {
    return { ignored: true };
  }

  async openBatteryOptimizationSettings(): Promise<void> {}

  async replacePillSchedules(
    _schedules: PillNotificationSchedule[],
  ): Promise<void> {}

  async replaceMenstruationSchedules(
    _schedules: MenstruationNotificationSchedule[],
  ): Promise<void> {}
}

export default new SubcycleRemindersModule();
