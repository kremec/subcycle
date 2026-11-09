import { type FC, useState } from "react";
import { View } from "react-native";

import { format, startOfMonth } from "date-fns";
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
}

export const Calendar: FC<CalendarProps> = (props) => {
  const { events, selectedDate, onPressDate } = props;
  const theme = useTheme();
  const [view, setView] = useState(() => {
    const month = format(startOfMonth(selectedDate), "yyyy-MM-dd");
    return {
      themeName: theme.themeName,
      initialMonth: month,
      visibleMonth: month,
    };
  });

  const getMarker = createCalendarMarkers(events, selectedDate, theme.colors);

  // The library caches styles and scrolls when current changes. Reset it only for a new theme.
  if (view.themeName !== theme.themeName) {
    setView({
      ...view,
      themeName: theme.themeName,
      initialMonth: view.visibleMonth,
    });
  }

  return (
    <CalendarList
      key={theme.themeName}
      current={view.initialMonth}
      onMonthChange={(month) =>
        setView((previous) => ({ ...previous, visibleMonth: month.dateString }))
      }
      horizontal
      pagingEnabled
      staticHeader
      pastScrollRange={120}
      futureScrollRange={120}
      showSixWeeks
      hideExtraDays
      firstDay={1}
      markingType="period"
      calendarStyle={{ backgroundColor: theme.colors.background }}
      headerStyle={{ backgroundColor: theme.colors.background }}
      renderHeader={(date) => (
        <View
          style={{
            minHeight: 44,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            variant="titleSmall"
            allowFontScaling={false}
            style={{ textAlign: "center" }}
          >
            {monthFormatter.format(
              date
                ? new Date(date.getFullYear(), date.getMonth(), 1)
                : selectedDate,
            )}
          </Typography>
        </View>
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
        arrowColor: theme.colors.textSecondary,
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
