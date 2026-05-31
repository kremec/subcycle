export type PillNotificationSchedule = {
  id: string;
  hour: number;
  minute: number;
};

export type MenstruationNotificationSchedule = {
  id: string;
  date: string;
  hour: number;
  minute: number;
  daysBefore: number;
  customMessage: string | null;
};

export type ReminderPermissionStatus = {
  granted: boolean;
  criticalAlertsEnabled?: boolean;
  timeSensitiveEnabled?: boolean;
};

export type ExactAlarmStatus = {
  available: boolean | null;
};

export type BatteryOptimizationStatus = {
  ignored: boolean;
};

export type ReminderAction =
  | {
      type: "check-pill";
      date: string;
    }
  | {
      type: "unknown";
    };

export type SubcycleRemindersModuleEvents = {
  reminderAction: (payload: ReminderAction) => void;
};
