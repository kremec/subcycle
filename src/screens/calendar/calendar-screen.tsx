import { type FC, useState } from "react";
import { Alert, ScrollView, View } from "react-native";

import { isSameDay } from "date-fns";

import { Screen } from "@/components/ui/screen";
import {
  toggleEventForDate,
  useEventsQuery,
} from "@/db/repositories/events-repository";
import {
  saveSymptoms,
  useSymptomsQuery,
} from "@/db/repositories/symptoms-repository";
import { getDayInCycle, getVisibleCycleEvents } from "@/domain/cycle";
import { getAllPredictions } from "@/domain/cycle-predictions";
import { Calendar } from "@/screens/calendar/components/calendar";
import { CalendarHeader } from "@/screens/calendar/components/calendar-header";
import { CycleAverages } from "@/screens/calendar/components/cycle-averages";
import { CycleStatus } from "@/screens/calendar/components/cycle-status";
import { DayLogCard } from "@/screens/calendar/components/day-log-card";
import { SymptomsEditSheet } from "@/screens/calendar/components/symptoms-edit-sheet";
import { PartnerHome } from "@/screens/partner/components/partner-home";
import { useSettingsStore } from "@/stores/settings-store";
import { useTheme } from "@/theme/use-theme";
import { t } from "@/translation/use-translation";
import { eventSchema } from "@/types/event";
import { symptomsSchema } from "@/types/symptom";

const CalendarScreen: FC = () => {
  const theme = useTheme();
  const { data: events } = useEventsQuery();
  const { data: symptoms } = useSymptomsQuery();
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const predictionTimespan = useSettingsStore(
    (state) => state.settings.predictionTimespan,
  );
  const partnerMode = useSettingsStore((state) => state.settings.partnerMode);
  const allEvents = getAllPredictions(events, predictionTimespan);
  const visibleEvents = getVisibleCycleEvents(allEvents);
  const selectedEvent =
    events.find((entry) => isSameDay(entry.date, selectedDate)) ??
    eventSchema.parse({ date: selectedDate });
  const selectedSymptoms =
    symptoms.find((entry) => isSameDay(entry.date, selectedDate)) ??
    symptomsSchema.parse({ date: selectedDate });
  const [symptomsEditorVisible, setSymptomsEditorVisible] = useState(false);

  return (
    <Screen style={{ paddingTop: 0 }}>
      <CalendarHeader />
      <ScrollView
        key={partnerMode ? "partner" : "calendar"}
        showsVerticalScrollIndicator={false}
        style={{ marginHorizontal: -theme.spacing.lg }}
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.lg,
          paddingBottom: theme.spacing.lg,
          gap: theme.spacing.lg,
        }}
      >
        {partnerMode && <PartnerHome events={allEvents} />}
        <CycleAverages events={events} />
        <CycleStatus events={visibleEvents} />
        {!partnerMode && (
          <View style={{ marginHorizontal: -theme.spacing.lg }}>
            <Calendar
              events={allEvents}
              selectedDate={selectedDate}
              onPressDate={setSelectedDate}
            />
          </View>
        )}
        {!partnerMode && (
          <DayLogCard
            event={selectedEvent}
            symptoms={selectedSymptoms}
            dayInCycle={getDayInCycle(selectedDate, visibleEvents)}
            onPressSymptoms={() => setSymptomsEditorVisible(true)}
            onToggle={(key) => {
              void toggleEventForDate(selectedDate, key).catch(() =>
                Alert.alert(t("common.saveFailed")),
              );
            }}
          />
        )}
      </ScrollView>
      {!partnerMode && (
        <SymptomsEditSheet
          visible={symptomsEditorVisible}
          symptoms={selectedSymptoms}
          onClose={() => setSymptomsEditorVisible(false)}
          onChange={saveSymptoms}
        />
      )}
    </Screen>
  );
};

export default CalendarScreen;
