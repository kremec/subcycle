import { Fragment, type FC, useState } from "react";
import { View } from "react-native";

import { Calendar } from "@/screens/calendar/components/calendar";
import { type CalendarState } from "@/screens/calendar/use-calendar-state";
import { PartnerDayNote } from "@/screens/partner/components/partner-day-note";
import { PartnerNotesSheet } from "@/screens/partner/components/partner-notes-sheet";
import { useTheme } from "@/theme/use-theme";

interface PartnerScreenProps {
  calendar: CalendarState;
}

const PartnerScreen: FC<PartnerScreenProps> = (props) => {
  const { calendar } = props;
  const theme = useTheme();
  const [notesVisible, setNotesVisible] = useState(false);

  return (
    <Fragment>
      <View style={{ flex: 1, gap: theme.spacing.md }}>
        <View
          style={{ flex: 3, minHeight: 6 * 32 + 80, maxHeight: 6 * 56 + 80 }}
        >
          <Calendar
            events={calendar.allEvents}
            selectedDate={calendar.selectedDate}
            visibleMonth={calendar.visibleMonth}
            onChangeMonth={calendar.setVisibleMonth}
            onPressDate={calendar.setSelectedDate}
          />
        </View>
        <PartnerDayNote
          date={calendar.selectedDate}
          dayInCycle={calendar.selectedDayInCycle}
          onPressAllNotes={() => setNotesVisible(true)}
        />
      </View>
      <PartnerNotesSheet
        visible={notesVisible}
        onClose={() => setNotesVisible(false)}
      />
    </Fragment>
  );
};

export default PartnerScreen;
