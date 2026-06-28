import { NativeModule, requireNativeModule } from 'expo';

import type {
  BatteryOptimizationStatus,
  ExactAlarmStatus,
  MenstruationNotificationSchedule,
  PillNotificationSchedule,
  ReminderPermissionStatus,
  SubcycleRemindersModuleEvents,
} from './SubcycleReminders.types';

declare class SubcycleRemindersModule extends NativeModule<SubcycleRemindersModuleEvents> {
  getPermissionsStatus(): Promise<ReminderPermissionStatus>;
  requestPermissions(): Promise<ReminderPermissionStatus>;
  getExactAlarmStatus(): Promise<ExactAlarmStatus>;
  openExactAlarmSettings(): Promise<void>;
  getBatteryOptimizationStatus(): Promise<BatteryOptimizationStatus>;
  openBatteryOptimizationSettings(): Promise<void>;
  replacePillSchedules(schedules: PillNotificationSchedule[]): Promise<void>;
  replaceMenstruationSchedules(
    schedules: MenstruationNotificationSchedule[],
  ): Promise<void>;
  setAutomaticBackupSettings(
    enabled: boolean,
    directoryUri: string | null,
  ): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<SubcycleRemindersModule>('SubcycleReminders');
