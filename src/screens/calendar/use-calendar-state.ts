import { useState } from "react";

import { startOfMonth } from "date-fns";

import { useEventsQuery } from "@/db/repositories/events-repository";
import { getDayInCycle, getVisibleCycleEvents } from "@/domain/cycle";
import { getAllPredictions } from "@/domain/cycle-predictions";
import { useSettingsStore } from "@/stores/settings-store";

export const useCalendarState = () => {
  const { data: events } = useEventsQuery();
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [visibleMonth, setVisibleMonth] = useState(() =>
    startOfMonth(new Date()),
  );
  const predictionsEnabled = useSettingsStore(
    (state) => state.settings.predictionsEnabled,
  );
  const allEvents = getAllPredictions(events, predictionsEnabled, visibleMonth);
  const visibleEvents = getVisibleCycleEvents(allEvents);
  const selectedDayInCycle = getDayInCycle(
    selectedDate,
    getVisibleCycleEvents(
      getAllPredictions(events, predictionsEnabled, selectedDate),
    ),
  );

  return {
    events,
    selectedDate,
    setSelectedDate,
    visibleMonth,
    setVisibleMonth,
    allEvents,
    visibleEvents,
    selectedDayInCycle,
  };
};

export type CalendarState = ReturnType<typeof useCalendarState>;
