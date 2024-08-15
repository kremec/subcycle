import React, { useEffect, useState } from 'react';
import { DateData, Calendar as RNCalendar, CalendarUtils } from 'react-native-calendars';

import { useTheme } from '../theme/ThemeContext';
import { useDb } from '../database/DbManager';
import { Event, isSameDate } from '../database/Types';
import CalendarEditDialog from './CalendarEditDialog';
import { CalendarColors } from '../theme/Colors';
import { getMenstruationPredictions, getOvulationPredictions } from '../stats/MenstruationPrediction';

const Calendar = () => {
    // Getting theme and data contexts
    const { theme } = useTheme();
    const { events, updateEvent } = useDb();

    // Marking dates
    const [loadingDates, setLoadingDates] = useState(true);
    const [markedDates, setMarkedDates] = useState({});
    useEffect(() => {
        // Watch out to not mutate events array in these functions
        const allEvents = [...events, ...getMenstruationPredictions(events), ...getOvulationPredictions(events)];
        if (!allEvents.some(e => isSameDate(e.date, new Date())))
            allEvents.push({ date: new Date(), menstruation: false, ovulation: false, tablet: false, prediction: false });

        const formattedEvents = formatCalendarDates(allEvents);
        setMarkedDates({...formattedEvents});

        setLoadingDates(false);
    }, [events, theme]);
    const formatCalendarDates = (events: Event[]) => {
        const markedDates: { [dateKey: string]: { selected: boolean; startingDay: boolean; endingDay: boolean; marked: boolean, color: string, dotColor: string, textColor: string } } = {};

        events.forEach(event => {
            const dateKey = CalendarUtils.getCalendarDateString(event.date);
            const color = getEventColor(event);
            const dotColor = getEventDotColor(event);
            const textColor = getEventTextColor(event);
            
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
                textColor
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
        if (event.tablet) return CalendarColors.tablet;
        else return CalendarColors.off;
    };
    const getEventTextColor = (event: Event) => {
        if (isSameDate(event.date, new Date())) return CalendarColors.today;
        else return (event.menstruation || event.ovulation) ? theme.colors.background : theme.colors.onBackground;
    };

    // Edit dialog
    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedDateEvents, setSelectedDateEvents] = useState<Event>();
    const calendarDayPress = (date: DateData) => {
        let event = events.find(e => isSameDate(date, e.date));
        if (!event)
            event = { date: new Date(date.dateString), menstruation: false, ovulation: false, tablet: false, prediction: false };

        setSelectedDateEvents(event);
        setDialogVisible(true);
    };

    return (
        <>
            <RNCalendar
                key={theme.mode} // Force remount when theme changes
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
                onDayPress={(date: DateData) => {calendarDayPress(date)}}
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
                    setSelectedDateEvents(undefined)
                }}
                onDone={(updatedDateEvent: Event) => {
                    updateEvent(updatedDateEvent);
                    setDialogVisible(false)
                    setSelectedDateEvents(undefined)
                }}
                selectedDateEvents={selectedDateEvents}
            />
        </>
    );
};

export default Calendar;
