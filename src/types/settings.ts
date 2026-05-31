import type { Time } from "@/types/time";

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
};

export function createDefaultSettings(): Settings {
  return {
    predictionTimespan: 0,
    pillNotificationsEnabled: false,
    pillNotificationTimes: [],
    menstruationNotificationsEnabled: false,
    menstruationNotifications: [],
    partnerMode: false,
  };
}
