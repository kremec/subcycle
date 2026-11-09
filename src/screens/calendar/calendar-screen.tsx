import { type FC, useState } from "react";
import { Alert, View } from "react-native";

import { isSameDay, startOfMonth } from "date-fns";

import { Screen } from "@/components/ui/screen";
import {
  setMenstruationFlowForDate,
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
import { CycleStatus } from "@/screens/calendar/components/cycle-status";
import { DayLogCard } from "@/screens/calendar/components/day-log-card";
import { SymptomsEditSheet } from "@/screens/calendar/components/symptoms-edit-sheet";
import { PartnerCycleGlance } from "@/screens/partner/components/partner-cycle-glance";
import { PartnerDateNavigation } from "@/screens/partner/components/partner-date-navigation";
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
  const predictionsEnabled = useSettingsStore(
    (state) => state.settings.predictionsEnabled,
  );
  const [visibleMonth, setVisibleMonth] = useState(() =>
    startOfMonth(new Date()),
  );
  const [partnerCalendarVisible, setPartnerCalendarVisible] = useState(false);
  const partnerMode = useSettingsStore((state) => state.settings.partnerMode);
  const allEvents = getAllPredictions(events, predictionsEnabled, visibleMonth);
  const visibleEvents = getVisibleCycleEvents(allEvents);
  const selectedDayInCycle = getDayInCycle(
    selectedDate,
    getVisibleCycleEvents(
      getAllPredictions(events, predictionsEnabled, selectedDate),
    ),
  );
  const selectedEvent =
    events.find((entry) => isSameDay(entry.date, selectedDate)) ??
    eventSchema.parse({ date: selectedDate });
  const selectedSymptoms =
    symptoms.find((entry) => isSameDay(entry.date, selectedDate)) ??
    symptomsSchema.parse({ date: selectedDate });
  const [symptomsEditorVisible, setSymptomsEditorVisible] = useState(false);

  return (
    <Screen
      style={{
        paddingTop: 0,
        paddingBottom: theme.spacing.sm,
        gap: theme.spacing.sm,
      }}
    >
      <CalendarHeader />
      {!partnerMode && <CycleStatus events={visibleEvents} />}
      {partnerMode && <PartnerCycleGlance events={visibleEvents} />}
      <View style={{ flex: 1, gap: theme.spacing.md }}>
        {partnerMode && (
          <PartnerDateNavigation
            date={selectedDate}
            dayInCycle={selectedDayInCycle}
            calendarVisible={partnerCalendarVisible}
            onToggleCalendar={() =>
              setPartnerCalendarVisible(!partnerCalendarVisible)
            }
            onChangeDate={(date) => {
              setSelectedDate(date);
              setVisibleMonth(startOfMonth(date));
              setPartnerCalendarVisible(false);
            }}
          />
        )}
        {(!partnerMode || partnerCalendarVisible) && (
          <View
            style={{
              flex: 1,
              maxHeight: partnerMode ? 6 * 56 + 80 : undefined,
            }}
          >
            <Calendar
              events={allEvents}
              selectedDate={selectedDate}
              visibleMonth={visibleMonth}
              onChangeMonth={setVisibleMonth}
              onPressDate={setSelectedDate}
            />
          </View>
        )}
        {partnerMode && (
          <PartnerHome
            compact={partnerCalendarVisible}
            dayInCycle={selectedDayInCycle}
          />
        )}
        {!partnerMode && (
          <DayLogCard
            event={selectedEvent}
            symptoms={selectedSymptoms}
            dayInCycle={selectedDayInCycle}
            onPressSymptoms={() => setSymptomsEditorVisible(true)}
            onChangeFlow={(flow) => {
              void setMenstruationFlowForDate(selectedDate, flow).catch(() =>
                Alert.alert(t("common.saveFailed")),
              );
            }}
            onToggle={(key) => {
              void toggleEventForDate(selectedDate, key).catch(() =>
                Alert.alert(t("common.saveFailed")),
              );
            }}
          />
        )}
      </View>
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
