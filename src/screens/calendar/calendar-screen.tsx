import { Fragment, type FC, useState } from "react";
import { Alert, View } from "react-native";

import { isSameDay } from "date-fns";

import {
  setMenstruationFlowForDate,
  toggleEventForDate,
} from "@/db/repositories/events-repository";
import {
  saveSymptoms,
  useSymptomsQuery,
} from "@/db/repositories/symptoms-repository";
import { Calendar } from "@/screens/calendar/components/calendar";
import { CycleStatus } from "@/screens/calendar/components/cycle-status";
import { DayLogCard } from "@/screens/calendar/components/day-log-card";
import { SymptomsEditSheet } from "@/screens/calendar/components/symptoms-edit-sheet";
import { type CalendarState } from "@/screens/calendar/use-calendar-state";
import { useTheme } from "@/theme/use-theme";
import { t } from "@/translation/use-translation";
import { eventSchema } from "@/types/event";
import { symptomsSchema } from "@/types/symptom";

interface CalendarScreenProps {
  calendar: CalendarState;
}

const CalendarScreen: FC<CalendarScreenProps> = (props) => {
  const { calendar } = props;
  const { events, selectedDate, selectedDayInCycle } = calendar;
  const theme = useTheme();
  const { data: symptoms } = useSymptomsQuery();
  const selectedEvent =
    events.find((entry) => isSameDay(entry.date, selectedDate)) ??
    eventSchema.parse({ date: selectedDate });
  const selectedSymptoms =
    symptoms.find((entry) => isSameDay(entry.date, selectedDate)) ??
    symptomsSchema.parse({ date: selectedDate });
  const [symptomsEditorVisible, setSymptomsEditorVisible] = useState(false);

  return (
    <Fragment>
      <CycleStatus events={calendar.visibleEvents} />
      <View style={{ flex: 1, gap: theme.spacing.md }}>
        <View style={{ flex: 1 }}>
          <Calendar
            events={calendar.allEvents}
            selectedDate={selectedDate}
            visibleMonth={calendar.visibleMonth}
            onChangeMonth={calendar.setVisibleMonth}
            onPressDate={calendar.setSelectedDate}
          />
        </View>
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
      </View>
      <SymptomsEditSheet
        visible={symptomsEditorVisible}
        symptoms={selectedSymptoms}
        onClose={() => setSymptomsEditorVisible(false)}
        onChange={saveSymptoms}
      />
    </Fragment>
  );
};

export default CalendarScreen;
