import type { Time } from "@/types/time";

export type AutomaticBackupFrequency = "daily" | "weekly" | "monthly";

export interface MenstruationNotification {
  dayToMenstruation: number;
  customMessage: string | null;
  notificationTime: Time;
}

export type Settings = {
  predictionTimespan: number;
  pillNotificationsEnabled: boolean;
  pillNotificationTimes: Time[];
  menstruationNotificationsEnabled: boolean;
  menstruationNotifications: MenstruationNotification[];
  partnerMode: boolean;
  automaticBackupsEnabled: boolean;
  automaticBackupFrequency: AutomaticBackupFrequency;
  automaticBackupDirectoryUri: string | null;
  lastAutomaticBackupAt: number | null;
};

export function createDefaultSettings(): Settings {
  return {
    predictionTimespan: 0,
    pillNotificationsEnabled: false,
    pillNotificationTimes: [],
    menstruationNotificationsEnabled: false,
    menstruationNotifications: [],
    partnerMode: false,
    automaticBackupsEnabled: false,
    automaticBackupFrequency: "weekly",
    automaticBackupDirectoryUri: null,
    lastAutomaticBackupAt: null,
  };
}
