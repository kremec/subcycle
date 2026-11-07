import { z } from "zod";

export enum MenstruationFlow {
  HEAVY = "menstruationHeavy",
  MODERATE = "menstruationModerate",
  LIGHT = "menstruationLight",
  SPOTTING = "menstruationSpotting",
}

export enum EventKind {
  NONE = "NONE",
  MENSTRUATION = "MENSTRUATION",
  OVULATION = "OVULATION",
}

const flag = z.boolean().default(false);

export const eventSchema = z
  .object({
    date: z.date(),
    menstruationLight: flag,
    menstruationModerate: flag,
    menstruationHeavy: flag,
    menstruationSpotting: flag,
    ovulation: flag,
    pill: flag,
    prediction: flag,
  })
  .transform((event) => {
    const menstruation =
      event.menstruationLight ||
      event.menstruationModerate ||
      event.menstruationHeavy ||
      event.menstruationSpotting;
    let kind = EventKind.NONE;
    if (menstruation) kind = EventKind.MENSTRUATION;
    else if (event.ovulation) kind = EventKind.OVULATION;

    return {
      ...event,
      kind,
      hasFlags: menstruation || event.ovulation || event.pill,
    };
  })
  .readonly();

export type Event = z.infer<typeof eventSchema>;
