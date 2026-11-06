import { z } from "zod";

const flag = z.boolean().default(false);

export const eventSchema = z.object({
  date: z.date(),
  menstruationLight: flag,
  menstruationModerate: flag,
  menstruationHeavy: flag,
  menstruationSpotting: flag,
  ovulation: flag,
  pill: flag,
  prediction: flag,
});

export type Event = z.infer<typeof eventSchema>;

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

export function hasAnyEventFlags(event: Event): boolean {
  return (
    event.menstruationLight ||
    event.menstruationModerate ||
    event.menstruationHeavy ||
    event.menstruationSpotting ||
    event.ovulation ||
    event.pill
  );
}

export function isMenstruationEvent(event: Event): boolean {
  return (
    event.menstruationLight ||
    event.menstruationModerate ||
    event.menstruationHeavy ||
    event.menstruationSpotting
  );
}

export function isOvulationEvent(event: Event): boolean {
  return event.ovulation;
}

export function getEventKind(event: Event | null | undefined): EventKind {
  if (!event) {
    return EventKind.NONE;
  }

  if (isMenstruationEvent(event)) {
    return EventKind.MENSTRUATION;
  }

  return isOvulationEvent(event) ? EventKind.OVULATION : EventKind.NONE;
}
