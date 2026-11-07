import { type FC } from "react";
import { Pressable, View } from "react-native";

import { isLastDayOfMonth } from "date-fns";

import { Typography } from "@/components/ui/typography";
import { useTheme } from "@/theme/use-theme";
import { dateFormatter, t } from "@/translation/use-translation";
import { EventGroupShape, type CalendarMarker } from "@/types/calendar-marker";

interface CalendarDayProps {
  marker: CalendarMarker;
  onPress: () => void;
}

export const CalendarDay: FC<CalendarDayProps> = (props) => {
  const { marker, onPress } = props;
  const theme = useTheme();
  const { date, group, prediction, color } = marker;
  const event = marker.event;
  const labels = [dateFormatter.format(date)];
  if (event?.menstruationLight) labels.push(t("calendar.edit.light"));
  if (event?.menstruationModerate) labels.push(t("calendar.edit.moderate"));
  if (event?.menstruationHeavy) labels.push(t("calendar.edit.heavy"));
  if (event?.menstruationSpotting) labels.push(t("calendar.edit.spotting"));
  if (event?.ovulation) labels.push(t("calendar.edit.ovulation"));
  if (color && prediction) labels.push(t("calendar.legend.predicted"));
  if (marker.pill) labels.push(t("calendar.legend.pill"));
  const single = group === EventGroupShape.SINGLE;
  const roundedLeft =
    single ||
    group === EventGroupShape.START ||
    date.getDay() === 1 ||
    date.getDate() === 1;
  const roundedRight =
    single ||
    group === EventGroupShape.END ||
    date.getDay() === 0 ||
    isLastDayOfMonth(date);
  const leftRadius = roundedLeft ? 1000 : 0;
  const rightRadius = roundedRight ? 1000 : 0;
  const borderWidth = prediction ? 1.5 : 0;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={labels.join(", ")}
      accessibilityState={{ selected: marker.selected }}
      style={{
        width: "100%",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          minHeight: 52,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {color !== null && (
          <View
            style={{
              position: "absolute",
              top: 4,
              bottom: 14,
              left: single ? "50%" : roundedLeft ? 1 : 0,
              right: single ? undefined : roundedRight ? 1 : 0,
              width: single ? 34 : undefined,
              marginLeft: single ? -17 : 0,
              backgroundColor: prediction ? undefined : color,
              borderColor: event?.ovulation
                ? theme.colors.calendarOvulationOutline
                : theme.colors.accent,
              borderTopWidth: borderWidth,
              borderBottomWidth: borderWidth,
              borderLeftWidth: roundedLeft ? borderWidth : 0,
              borderRightWidth: roundedRight ? borderWidth : 0,
              borderTopLeftRadius: leftRadius,
              borderBottomLeftRadius: leftRadius,
              borderTopRightRadius: rightRadius,
              borderBottomRightRadius: rightRadius,
            }}
          />
        )}

        <View
          style={{
            position: "absolute",
            top: 5,
            width: 32,
            height: 32,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: theme.radius.full,
            borderWidth: marker.selected ? 2 : 0,
            borderColor: marker.textColor,
          }}
        >
          <Typography
            variant="bodySmall"
            allowFontScaling={false}
            color={marker.textColor}
            style={{ fontWeight: marker.selected ? "700" : "500" }}
          >
            {date.getDate()}
          </Typography>
        </View>
        {marker.pill && (
          <View
            style={{
              position: "absolute",
              bottom: 3,
              width: 12,
              height: 6,
              borderRadius: theme.radius.full,
              backgroundColor: theme.colors.calendarPill,
            }}
          />
        )}
      </View>
    </Pressable>
  );
};
