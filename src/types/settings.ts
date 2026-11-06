import { z } from "zod";

const menstruationNotificationSchema = z.object({
  dayToMenstruation: z.number(),
  customMessage: z.string().nullable(),
  notificationTime: z.iso.time({ precision: -1 }),
});

export type MenstruationNotification = z.infer<
  typeof menstruationNotificationSchema
>;

export const settingsSchema = z.object({
  predictionTimespan: z.number().default(0),
  pillNotificationsEnabled: z.boolean().default(false),
  pillNotificationTimes: z.array(z.iso.time({ precision: -1 })).default([]),
  menstruationNotificationsEnabled: z.boolean().default(false),
  menstruationNotifications: z
    .array(menstruationNotificationSchema)
    .default([]),
  partnerMode: z.boolean().default(false),
});

export type Settings = z.infer<typeof settingsSchema>;
