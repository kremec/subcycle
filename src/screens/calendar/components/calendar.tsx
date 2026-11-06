import { type FC, useRef } from "react";
import { Pressable } from "react-native";

import { format } from "date-fns";
import { CalendarList } from "react-native-calendars";

import { Typography } from "@/components/ui/typography";
import { createCalendarMarkers } from "@/domain/calendar-markers";
import { CalendarDay } from "@/screens/calendar/components/calendar-day";
import { useTheme } from "@/theme/use-theme";
import { monthFormatter } from "@/translation/use-translation";
import { type Event } from "@/types/event";

interface CalendarProps {
  events: Event[];
  selectedDate: Date;
  onPressDate: (date: Date) => void;
  onPressToday: (date: Date) => void;
}

export const Calendar: FC<CalendarProps> = (props) => {
  const { events, selectedDate, onPressDate, onPressToday } = props;
  const theme = useTheme();
  const calendarRef = useRef<{ scrollToMonth?: (date: string) => void } | null>(
    null,
  );

  const getMarker = createCalendarMarkers(events, selectedDate, theme.colors);

  return (
    <CalendarList
      ref={calendarRef}
      current={format(selectedDate, "yyyy-MM-dd")}
      horizontal
      pagingEnabled
      staticHeader
      pastScrollRange={120}
      futureScrollRange={120}
      hideArrows
      showSixWeeks
      hideExtraDays
      firstDay={1}
      markingType="period"
      calendarStyle={{ backgroundColor: theme.colors.background }}
      headerStyle={{ backgroundColor: theme.colors.background }}
      renderHeader={(date) => (
        <Pressable
          onPress={() => {
            const today = new Date();
            onPressToday(today);
            calendarRef.current?.scrollToMonth?.(format(today, "yyyy-MM-dd"));
          }}
        >
          <Typography variant="titleSmall" style={{ textAlign: "center" }}>
            {monthFormatter.format(
              date
                ? new Date(date.getFullYear(), date.getMonth(), 1)
                : selectedDate,
            )}
          </Typography>
        </Pressable>
      )}
      dayComponent={(dayProps) => {
        const { date } = dayProps;
        if (!date) {
          return null;
        }

        const calendarDate = new Date(date.year, date.month - 1, date.day, 12);

        return (
          <CalendarDay
            marker={getMarker(calendarDate)}
            onPress={() => onPressDate(calendarDate)}
          />
        );
      }}
      theme={{
        calendarBackground: theme.colors.background,
        dayTextColor: theme.colors.text,
        monthTextColor: theme.colors.text,
        todayTextColor: theme.colors.accent,
        textDayHeaderFontSize: theme.typography.bodySmall.fontSize,
        textMonthFontSize: theme.typography.title.fontSize,
        weekVerticalMargin: 2,
        textSectionTitleColor: theme.colors.textSecondary,
        ...{
          "stylesheet.calendar.header": {
            week: {
              marginTop: 7,
              flexDirection: "row",
              justifyContent: "space-around",
            },
            dayHeader: {
              marginTop: 2,
              marginBottom: 7,
              width: 32,
              textAlign: "center",
              ...theme.typography.bodySmall,
              color: theme.colors.textSecondary,
            },
          },
          "stylesheet.calendar.main": {
            monthView: {
              backgroundColor: theme.colors.calendarOff,
            },
          },
        },
      }}
    />
  );
};
