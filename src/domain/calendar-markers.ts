import { addDays, format, isLastDayOfMonth, isSameDay } from "date-fns";

import { getVisibleCycleEvents } from "@/domain/cycle";
import type { Palette } from "@/theme/palette";
import { type CalendarMarker } from "@/types/calendar-marker";
import { EventKind, type Event } from "@/types/event";

const dateKey = (date: Date) => format(date, "yyyy-MM-dd");

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
    if (!event.prediction) actualEvents.set(dateKey(event.date), event);
  }
  for (const event of getVisibleCycleEvents(events)) {
    if (event.prediction) predictedEvents.set(dateKey(event.date), event);
  }

  return (date: Date): CalendarMarker => {
    const key = dateKey(date);
    const actual = actualEvents.get(key);
    const prediction = (actual?.kind ?? EventKind.NONE) === EventKind.NONE;
    const visibleEvents = prediction ? predictedEvents : actualEvents;
    const event = visibleEvents.get(key);
    const period = event?.kind === EventKind.MENSTRUATION;

    return {
      date,
      color: getColor(event, colors),
      joinsPrevious:
        period &&
        date.getDay() !== 1 &&
        date.getDate() !== 1 &&
        visibleEvents.get(dateKey(addDays(date, -1)))?.kind ===
          EventKind.MENSTRUATION,
      joinsNext:
        period &&
        date.getDay() !== 0 &&
        !isLastDayOfMonth(date) &&
        visibleEvents.get(dateKey(addDays(date, 1)))?.kind ===
          EventKind.MENSTRUATION,
      prediction,
      pill: actual?.pill ?? false,
      event,
      selected: isSameDay(date, selectedDate),
    };
  };
}
