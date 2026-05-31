import { isSameDay, set as setDateTime } from "date-fns";
import { type FC, useState } from "react";
import { View } from "react-native";

import { Screen } from "@/components/ui";
import { useEventsQuery } from "@/db/queries/use-events-query";
import { useSymptomsQuery } from "@/db/queries/use-symptoms-query";
import { upsertEvent } from "@/db/repositories/events-repository";
import { upsertSymptoms } from "@/db/repositories/symptoms-repository";
import { getDayInCycle } from "@/domain/events/get-day-in-cycle";
import { getMenstruationPredictions } from "@/domain/predictions/get-menstruation-predictions";
import { getOvulationPredictions } from "@/domain/predictions/get-ovulation-predictions";
import { Calendar } from "@/screens/calendar/components/calendar";
import { CalendarEditDialog } from "@/screens/calendar/components/calendar-edit-dialog";
import { CycleStatus } from "@/screens/calendar/components/cycle-status";
import { SymptomsEditSheet } from "@/screens/calendar/components/symptoms-edit-sheet";
import { SymptomsOverview } from "@/screens/calendar/components/symptoms-overview";
import { useSettingsStore } from "@/stores/settings-store";
import { useTheme } from "@/theme/use-theme";
import { createDefaultEvent, createDefaultSymptoms, type Event } from "@/types";

function toCalendarDate(date: Date): Date {
  return setDateTime(date, {
    hours: 12,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });
}

const CalendarScreen: FC = () => {
  const theme = useTheme();
  const { data: events } = useEventsQuery();
  const { data: symptoms } = useSymptomsQuery();
  const [selectedDate, setSelectedDateState] = useState(() =>
    toCalendarDate(new Date()),
  );
  const {
    settings: { predictionTimespan },
  } = useSettingsStore();

  const setSelectedDate = (date: Date) => {
    setSelectedDateState(toCalendarDate(date));
  };

  const predictedEvents = [
    ...getMenstruationPredictions(events, predictionTimespan),
    ...getOvulationPredictions(events, predictionTimespan),
  ];
  const allEvents = [...events, ...predictedEvents];

  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const editingDayInCycle = editingEvent
    ? getDayInCycle(editingEvent.date, allEvents)
    : null;

  const selectedSymptoms =
    symptoms.find((entry) => isSameDay(entry.date, selectedDate)) ??
    createDefaultSymptoms(selectedDate);

  const [symptomsEditorVisible, setSymptomsEditorVisible] = useState(false);

  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <CycleStatus events={allEvents} />

        <View>
          <View style={{ marginHorizontal: -theme.spacing.lg }}>
            <Calendar
              events={allEvents}
              selectedDate={selectedDate}
              onPressToday={setSelectedDate}
              onPressDate={(date) => {
                if (!isSameDay(date, selectedDate)) {
                  setSelectedDate(date);
                  return;
                }

                setEditingEvent(
                  allEvents.find((entry) => isSameDay(entry.date, date)) ??
                    createDefaultEvent(date),
                );
              }}
            />
          </View>
          <SymptomsOverview
            selectedDate={selectedDate}
            symptoms={selectedSymptoms}
            onPressEdit={() => setSymptomsEditorVisible(true)}
          />
        </View>
      </View>

      <SymptomsEditSheet
        visible={symptomsEditorVisible}
        symptoms={selectedSymptoms}
        onClose={() => setSymptomsEditorVisible(false)}
        onChange={(nextSymptoms) => {
          upsertSymptoms(nextSymptoms);
        }}
      />

      <CalendarEditDialog
        key={editingEvent?.date.toISOString() ?? "empty"}
        visible={editingEvent !== null}
        selectedEvent={editingEvent}
        dayInCycle={editingDayInCycle}
        onClose={() => {
          setEditingEvent(null);
        }}
        onSave={(event) => {
          upsertEvent(event);
          setEditingEvent(null);
        }}
      />
    </Screen>
  );
};

export default CalendarScreen;
