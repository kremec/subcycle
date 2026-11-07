import { type FC, useState } from "react";
import { ScrollView, View } from "react-native";

import { isSameDay } from "date-fns";

import { Screen } from "@/components/ui/screen";
import { saveEvent, useEventsQuery } from "@/db/repositories/events-repository";
import {
  saveSymptoms,
  useSymptomsQuery,
} from "@/db/repositories/symptoms-repository";
import { getDayInCycle } from "@/domain/cycle";
import { getAllPredictions } from "@/domain/cycle-predictions";
import { Calendar } from "@/screens/calendar/components/calendar";
import { CalendarEditDialog } from "@/screens/calendar/components/calendar-edit-dialog";
import { CalendarHeader } from "@/screens/calendar/components/calendar-header";
import { CalendarLegend } from "@/screens/calendar/components/calendar-legend";
import { CycleStatus } from "@/screens/calendar/components/cycle-status";
import { SymptomsEditSheet } from "@/screens/calendar/components/symptoms-edit-sheet";
import { SymptomsOverview } from "@/screens/calendar/components/symptoms-overview";
import { useSettingsStore } from "@/stores/settings-store";
import { useTheme } from "@/theme/use-theme";
import { eventSchema, type Event } from "@/types/event";
import { symptomsSchema } from "@/types/symptom";

const CalendarScreen: FC = () => {
  const theme = useTheme();
  const { data: events } = useEventsQuery();
  const { data: symptoms } = useSymptomsQuery();
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const predictionTimespan = useSettingsStore(
    (state) => state.settings.predictionTimespan,
  );

  const allEvents = getAllPredictions(events, predictionTimespan);

  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const selectedSymptoms =
    symptoms.find((entry) => isSameDay(entry.date, selectedDate)) ??
    symptomsSchema.parse({ date: selectedDate });

  const [symptomsEditorVisible, setSymptomsEditorVisible] = useState(false);

  return (
    <Screen style={{ paddingTop: 0 }}>
      <CalendarHeader />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginHorizontal: -theme.spacing.lg }}
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.lg,
          paddingBottom: theme.spacing.lg,
          gap: theme.spacing.lg,
        }}
      >
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
                    eventSchema.parse({ date }),
                );
              }}
            />
          </View>
          <CalendarLegend />
          <SymptomsOverview
            symptoms={selectedSymptoms}
            onPressEdit={() => setSymptomsEditorVisible(true)}
            onPressLog={() =>
              setEditingEvent(
                allEvents.find((entry) =>
                  isSameDay(entry.date, selectedDate),
                ) ?? eventSchema.parse({ date: selectedDate }),
              )
            }
          />
        </View>
      </ScrollView>

      <SymptomsEditSheet
        visible={symptomsEditorVisible}
        symptoms={selectedSymptoms}
        onClose={() => setSymptomsEditorVisible(false)}
        onChange={saveSymptoms}
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
