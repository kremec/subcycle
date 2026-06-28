import { NativeModule } from "expo";

import type {
  BatteryOptimizationStatus,
  ExactAlarmStatus,
  MenstruationNotificationSchedule,
  PillNotificationSchedule,
  ReminderPermissionStatus,
  SubcycleRemindersModuleEvents,
} from "./SubcycleReminders.types";

class SubcycleRemindersModule
  extends NativeModule<SubcycleRemindersModuleEvents>
{
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

  async setAutomaticBackupSettings(
    _enabled: boolean,
    _directoryUri: string | null,
  ): Promise<void> {}
}

export default new SubcycleRemindersModule();
