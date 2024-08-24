import React, { useEffect, useState } from 'react';
import { DateData, Calendar as RNCalendar, CalendarUtils } from 'react-native-calendars';

import { useTheme } from '../theme/ThemeContext';
import { useAppContext } from '../app/AppContext';
import { Event, getMonthYear, isSameDate } from '../app/Types';
import CalendarEditDialog from './CalendarEditDialog';
import { CalendarColors } from '../theme/Colors';

import { TextStyle, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';

const Calendar = () => {
    // Getting theme and data contexts
    const { theme } = useTheme();
    const { events, updateEvent } = useAppContext();

    // Marking dates
    const [loadingDates, setLoadingDates] = useState(true);
    const [markedDates, setMarkedDates] = useState({});
    useEffect(() => {
        setLoadingDates(true);

        // Watch out to not mutate events array in this function
        const formattedEvents = formatCalendarDates(events);
        setMarkedDates({ ...formattedEvents });

        setLoadingDates(false);
    }, [events, theme]);
    const formatCalendarDates = (events: Event[]) => {
        const markedDates: { [dateKey: string]: { selected: boolean; startingDay: boolean; endingDay: boolean; marked: boolean, color: string, dotColor: string, customTextStyle?: TextStyle } } = {};

        events.forEach(event => {
            const dateKey = CalendarUtils.getCalendarDateString(event.date);
            const color = getEventColor(event);
            const dotColor = getEventDotColor(event);
            const customTextStyle = getEventTextStyle(event);

            var dayBefore = new Date(event.date);
            dayBefore.setDate(event.date.getDate() - 1);
            var dayAfter = new Date(event.date);
            dayAfter.setDate(event.date.getDate() + 1);

            markedDates[dateKey] = {
                selected: true,
                // If there is no event on the previous day with same color, mark it as starting day
                startingDay: !events.some(e => isSameDate(e.date, dayBefore) && getEventColor(event) === getEventColor(e)),
                // If there is no event on the next day with same color, mark it as ending day
                endingDay: !events.some(e => isSameDate(e.date, dayAfter) && getEventColor(event) === getEventColor(e)),
                marked: true,
                color,
                dotColor,
                customTextStyle
            };
        });

        return markedDates;
    };
    const getEventColor = (event: Event) => {
        if (event.prediction) {
            if (event.menstruation) return CalendarColors.predictedMenstruation;
            else if (event.ovulation) return CalendarColors.predictedOvulation;
            else return CalendarColors.off;
        }
        else {
            if (event.menstruation) return CalendarColors.menstruation;
            else if (event.ovulation) return CalendarColors.ovulation;
            else return CalendarColors.off;
        }
    };
    const getEventDotColor = (event: Event) => {
        if (event.pill) return CalendarColors.pill;
        else return CalendarColors.off;
    };
    const getEventTextStyle = (event: Event) => {
        const textStyle: TextStyle = { color: (event.menstruation || event.ovulation) ? theme.colors.background : theme.colors.onBackground };

        if (isSameDate(event.date, new Date()))
            textStyle.fontWeight = 'bold';

        return textStyle;
    };

    // Edit dialog
    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event>();
    const calendarDayPress = (date: DateData) => {
        let event = events.find(e => isSameDate(date, e.date));
        if (!event)
            event = { date: new Date(date.dateString), menstruation: false, ovulation: false, pill: false, prediction: false };

        setSelectedEvent(event);
        setDialogVisible(true);
    };

    const [headerClicked, setHeaderClicked] = useState(false);

    return (
        <>
            <RNCalendar
                key={theme.mode?.toString() + headerClicked.toString()} // Force remount when theme changes
                horizontal={true}
                pagingEnabled={true}
                futureScrollRange={0}
                enableSwipeMonths={true}
                hideArrows={true}
                showSixWeeks={true}
                hideExtraDays={true}
                firstDay={1}
                markingType={'period'}
                markedDates={markedDates}
                displayLoadingIndicator={loadingDates}
                onDayPress={(date: DateData) => { calendarDayPress(date) }}
                renderHeader={(date: string) => {
                    return (
                        <TouchableOpacity onPress={() => { setHeaderClicked(!headerClicked) }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
                                {getMonthYear(new Date(date))}
                            </Text>
                        </TouchableOpacity>
                    );
                }}
                theme={{
                    calendarBackground: theme.colors.background,
                    dayTextColor: theme.colors.onBackground,
                    monthTextColor: theme.colors.onBackground,
                    selectedDayTextColor: 'black',
                }}
            />

            <CalendarEditDialog
                visible={dialogVisible}
                onCancel={() => {
                    setDialogVisible(false)
                    setSelectedEvent(undefined)
                }}
                onDone={(updatedDateEvent: Event) => {
                    updateEvent(updatedDateEvent);
                    setDialogVisible(false)
                    setSelectedEvent(undefined)
                }}
                selectedEvent={selectedEvent}
            />
        </>
    );
};

export default Calendar;
