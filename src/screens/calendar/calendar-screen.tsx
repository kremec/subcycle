import { type FC, useState } from "react";
import { View } from "react-native";

import { isSameDay } from "date-fns";

import { Screen } from "@/components/ui/screen";
import { useEventsQuery } from "@/db/repositories/events-repository";
import { upsertEvent } from "@/db/repositories/events-repository";
import { useSymptomsQuery } from "@/db/repositories/symptoms-repository";
import { upsertSymptoms } from "@/db/repositories/symptoms-repository";
import { getDayInCycle, withPredictions } from "@/domain/cycle";
import { toCalendarDate } from "@/domain/time";
import { Calendar } from "@/screens/calendar/components/calendar";
import { CalendarEditDialog } from "@/screens/calendar/components/calendar-edit-dialog";
import { CycleStatus } from "@/screens/calendar/components/cycle-status";
import { SymptomsEditSheet } from "@/screens/calendar/components/symptoms-edit-sheet";
import { SymptomsOverview } from "@/screens/calendar/components/symptoms-overview";
import { useSettingsStore } from "@/stores/settings-store";
import { useTheme } from "@/theme/use-theme";
import { createDefaultEvent, createDefaultSymptoms, type Event } from "@/types";

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

  const allEvents = withPredictions(events, predictionTimespan);

  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const selectedSymptoms =
    symptoms.find((entry) => isSameDay(entry.date, selectedDate)) ??
    createDefaultSymptoms(selectedDate);

  const [symptomsEditorVisible, setSymptomsEditorVisible] = useState(false);

  return (
    <Screen
      style={{
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.md,
        gap: theme.spacing.lg,
      }}
    >
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

      {editingEvent && (
        <CalendarEditDialog
          event={editingEvent}
          dayInCycle={getDayInCycle(editingEvent.date, allEvents)}
          onClose={() => setEditingEvent(null)}
          onSave={(event) => {
            upsertEvent(event);
            setEditingEvent(null);
          }}
        />
      )}
    </Screen>
  );
};

export default CalendarScreen;
