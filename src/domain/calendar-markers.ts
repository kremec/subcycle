import { addDays, format, isSameDay } from "date-fns";

import type { themePalettes } from "@/theme/palette";
import { EventGroupShape, type CalendarMarker } from "@/types/calendar-marker";
import { EventKind, type Event } from "@/types/event";

type Palette = (typeof themePalettes)[keyof typeof themePalettes];

const dateKey = (date: Date) => format(date, "yyyy-MM-dd");

function getGroupShape(
  date: Date,
  events: Map<string, Event>,
  kind: EventKind,
) {
  if (kind === EventKind.NONE) return EventGroupShape.NONE;

  const previous = events.get(dateKey(addDays(date, -1)))?.kind === kind;
  const next = events.get(dateKey(addDays(date, 1)))?.kind === kind;

  if (!previous && !next) return EventGroupShape.SINGLE;
  if (!previous) return EventGroupShape.START;
  return next ? EventGroupShape.MIDDLE : EventGroupShape.END;
}

function getColor(event: Event | undefined, colors: Palette) {
  if (!event) return null;
  if (event.ovulation) return colors.calendarOvulation;
  if (event.menstruationLight || event.menstruationSpotting) {
    return colors.calendarMenstruationLight;
  }
  if (event.menstruationModerate) return colors.calendarMenstruationModerate;
  if (event.menstruationHeavy) return colors.calendarMenstruationHeavy;
  return null;
}

export function createCalendarMarkers(
  events: Event[],
  selectedDate: Date,
  colors: Palette,
) {
  const actualEvents = new Map<string, Event>();
  const predictedEvents = new Map<string, Event>();

  for (const event of events) {
    const target = event.prediction ? predictedEvents : actualEvents;
    target.set(dateKey(event.date), event);
  }

  return (date: Date): CalendarMarker => {
    const key = dateKey(date);
    const actual = actualEvents.get(key);
    const prediction = (actual?.kind ?? EventKind.NONE) === EventKind.NONE;
    const visibleEvents = prediction ? predictedEvents : actualEvents;
    const event = visibleEvents.get(key);

    return {
      date,
      color: getColor(event, colors),
      group: getGroupShape(date, visibleEvents, event?.kind ?? EventKind.NONE),
      prediction,
      textColor: colors.text,
      pill: actual?.pill ?? false,
      event,
      selected: isSameDay(date, selectedDate),
    };
  };
}
