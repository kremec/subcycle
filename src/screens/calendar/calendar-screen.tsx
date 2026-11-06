import { type FC, useState } from "react";
import { View } from "react-native";

import { isSameDay, startOfDay } from "date-fns";

import { Screen } from "@/components/ui/screen";
import { useEventsQuery } from "@/db/repositories/events-repository";
import { saveEvent } from "@/db/repositories/events-repository";
import { useSymptomsQuery } from "@/db/repositories/symptoms-repository";
import { saveSymptoms } from "@/db/repositories/symptoms-repository";
import { getDayInCycle } from "@/domain/cycle";
import { getAllPredictions } from "@/domain/cycle-predictions";
import { Calendar } from "@/screens/calendar/components/calendar";
import { CalendarEditDialog } from "@/screens/calendar/components/calendar-edit-dialog";
import { CycleStatus } from "@/screens/calendar/components/cycle-status";
import { SymptomsEditSheet } from "@/screens/calendar/components/symptoms-edit-sheet";
import { SymptomsOverview } from "@/screens/calendar/components/symptoms-overview";
import { useSettingsStore } from "@/stores/settings-store";
import { useTheme } from "@/theme/use-theme";
import { createDefaultEvent, type Event } from "@/types/event";
import { createDefaultSymptoms } from "@/types/symptoms";

const CalendarScreen: FC = () => {
  const theme = useTheme();
  const { data: events } = useEventsQuery();
  const { data: symptoms } = useSymptomsQuery();
  const [selectedDate, setSelectedDateState] = useState(() =>
    startOfDay(new Date()),
  );
  const predictionTimespan = useSettingsStore(
    (state) => state.settings.predictionTimespan,
  );

  const setSelectedDate = (date: Date) => {
    setSelectedDateState(startOfDay(date));
  };

  const allEvents = getAllPredictions(events, predictionTimespan);

  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

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
          saveSymptoms(nextSymptoms);
        }}
      />

      {editingEvent && (
        <CalendarEditDialog
          event={editingEvent}
          dayInCycle={getDayInCycle(editingEvent.date, allEvents)}
          onClose={() => setEditingEvent(null)}
          onSave={(event) => {
            saveEvent(event);
            setEditingEvent(null);
          }}
        />
      )}
    </Screen>
  );
};

export default CalendarScreen;
