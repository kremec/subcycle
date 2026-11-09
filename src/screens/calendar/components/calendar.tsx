import { type FC, useState } from "react";
import { View } from "react-native";

import { format } from "date-fns";
import { Calendar as NativeCalendar } from "react-native-calendars";

import { Typography } from "@/components/ui/typography";
import { createCalendarMarkers } from "@/domain/calendar-markers";
import { CalendarDay } from "@/screens/calendar/components/calendar-day";
import { useTheme } from "@/theme/use-theme";
import { monthFormatter } from "@/translation/use-translation";
import { type Event } from "@/types/event";

interface CalendarProps {
  events: Event[];
  selectedDate: Date;
  visibleMonth: Date;
  onPressDate: (date: Date) => void;
  onChangeMonth: (date: Date) => void;
}

export const Calendar: FC<CalendarProps> = (props) => {
  const { events, selectedDate, visibleMonth, onPressDate, onChangeMonth } =
    props;
  const theme = useTheme();
  const [dayHeight, setDayHeight] = useState(44);
  const getMarker = createCalendarMarkers(events, selectedDate, theme.colors);

  return (
    <View
      style={{ flex: 1, justifyContent: "flex-start" }}
      onLayout={(event) => {
        const available = event.nativeEvent.layout.height;
        setDayHeight(
          Math.max(32, Math.min(56, Math.floor((available - 80) / 6))),
        );
      }}
    >
      <NativeCalendar
        key={theme.themeName}
        current={format(visibleMonth, "yyyy-MM-dd")}
        onMonthChange={(month) =>
          onChangeMonth(new Date(month.year, month.month - 1, 1, 12))
        }
        enableSwipeMonths
        hideExtraDays
        firstDay={1}
        testID="cycle-calendar"
        style={{ backgroundColor: theme.colors.background }}
        renderHeader={(date) => (
          <Typography variant="titleSmall" allowFontScaling={false}>
            {monthFormatter.format(
              date
                ? new Date(date.getFullYear(), date.getMonth(), 1)
                : visibleMonth,
            )}
          </Typography>
        )}
        dayComponent={(dayProps) => {
          const { date } = dayProps;
          if (!date) return null;
          const calendarDate = new Date(
            date.year,
            date.month - 1,
            date.day,
            12,
          );
          return (
            <CalendarDay
              marker={getMarker(calendarDate)}
              height={dayHeight}
              onPress={() => onPressDate(calendarDate)}
            />
          );
        }}
        theme={{
          calendarBackground: theme.colors.background,
          arrowColor: theme.colors.textSecondary,
          textSectionTitleColor: theme.colors.textSecondary,
          textDayHeaderFontSize: 12,
          weekVerticalMargin: 0,
          ...{
            "stylesheet.calendar.header": {
              header: {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              },
              week: {
                flexDirection: "row",
                justifyContent: "space-around",
                marginBottom: 4,
              },
              dayHeader: {
                width: 32,
                textAlign: "center",
                ...theme.typography.caption,
                color: theme.colors.textSecondary,
              },
            },
          },
        }}
      />
    </View>
  );
};
