export type Event = {
  date: Date;
  menstruationLight: boolean;
  menstruationModerate: boolean;
  menstruationHeavy: boolean;
  menstruationSpotting: boolean;
  ovulation: boolean;
  pill: boolean;
  prediction: boolean;
};

export enum EventKind {
  NONE = "NONE",
  MENSTRUATION = "MENSTRUATION",
  OVULATION = "OVULATION",
}

export function createDefaultEvent(date: Date): Event {
  return {
    date,
    menstruationLight: false,
    menstruationModerate: false,
    menstruationHeavy: false,
    menstruationSpotting: false,
    ovulation: false,
    pill: false,
    prediction: false,
  };
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

export function isHeavyMenstruationEvent(event: Event): boolean {
  return event.menstruationHeavy;
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
