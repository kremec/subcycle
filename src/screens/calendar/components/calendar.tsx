import { type FC, useRef } from "react";
import { Pressable } from "react-native";

import { addDays, format, isSameDay } from "date-fns";
import { CalendarList, type DateData } from "react-native-calendars";

import { Typography } from "@/components/ui";
import { CalendarDay } from "@/screens/calendar/components/calendar-day";
import { useTheme } from "@/theme/use-theme";
import {
  EventGroupShape,
  EventKind,
  getEventKind,
  type CalendarMarker,
  type Event,
} from "@/types";

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

  const getKey = (date: Date) => format(date, "yyyy-MM-dd");
  const getDate = (date: DateData) =>
    new Date(date.year, date.month - 1, date.day, 12);
  const getColor = (event: Event | null | undefined) => {
    if (!event) {
      return null;
    }

    if (event.ovulation) {
      return theme.colors.calendarOvulation;
    }

    if (event.menstruationLight || event.menstruationSpotting) {
      return theme.colors.calendarMenstruationLight;
    }

    if (event.menstruationModerate) {
      return theme.colors.calendarMenstruationModerate;
    }

    if (event.menstruationHeavy) {
      return theme.colors.calendarMenstruationHeavy;
    }

    return null;
  };

  const actualEventMap = new Map<string, Event>();
  const predictionEventMap = new Map<string, Event>();

  events.forEach((event) => {
    (event.prediction ? predictionEventMap : actualEventMap).set(
      getKey(event.date),
      event,
    );
  });

  const getGroupShape = (
    date: Date,
    eventMap: Map<string, Event>,
    kind: EventKind,
  ): CalendarMarker["actualGroup"] => {
    if (kind === EventKind.NONE) {
      return EventGroupShape.NONE;
    }

    const previousSame =
      getEventKind(eventMap.get(getKey(addDays(date, -1)))) === kind;
    const nextSame =
      getEventKind(eventMap.get(getKey(addDays(date, 1)))) === kind;

    if (!previousSame && !nextSame) {
      return EventGroupShape.SINGLE;
    }

    if (!previousSame) {
      return EventGroupShape.START;
    }

    return nextSame ? EventGroupShape.MIDDLE : EventGroupShape.END;
  };

  const getMarker = (date: Date): CalendarMarker => {
    const actualEvent = actualEventMap.get(getKey(date)) ?? null;
    const predictionEvent = predictionEventMap.get(getKey(date)) ?? null;
    const actualKind = getEventKind(actualEvent);
    const predictionKind = getEventKind(predictionEvent);

    return {
      date,
      actualColor: getColor(actualEvent),
      actualGroup: getGroupShape(date, actualEventMap, actualKind),
      predictionColor:
        actualKind === EventKind.NONE ? getColor(predictionEvent) : null,
      predictionGroup: getGroupShape(date, predictionEventMap, predictionKind),
      textColor:
        actualKind !== EventKind.NONE
          ? theme.colors.surface
          : theme.colors.text,
      dotColor: actualEvent?.pill ? theme.colors.calendarPill : "transparent",
      selected: isSameDay(date, selectedDate),
    };
  };

  return (
    <CalendarList
      ref={calendarRef}
      current={getKey(selectedDate)}
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
            const now = new Date();
            const today = new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate(),
              12,
            );

            onPressToday(today);
            calendarRef.current?.scrollToMonth?.(getKey(today));
          }}
        >
          <Typography variant="titleSmall" style={{ textAlign: "center" }}>
            {date?.toString("MMMM yyyy") ?? format(selectedDate, "MMMM yyyy")}
          </Typography>
        </Pressable>
      )}
      dayComponent={(dayProps) => {
        const { date } = dayProps;
        if (!date) {
          return null;
        }

        const calendarDate = getDate(date);

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
        textDayHeaderFontSize: theme.typography.bodySmall,
        textMonthFontSize: 24,
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
              fontSize: theme.typography.bodySmall,
              lineHeight: theme.typography.bodySmall + 4,
              fontWeight: "500",
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
