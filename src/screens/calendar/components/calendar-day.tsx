import { type FC } from "react";
import { Pressable, View } from "react-native";

import { isLastDayOfMonth } from "date-fns";

import { Typography } from "@/components/ui/typography";
import { typography } from "@/theme/tokens";
import { EventGroupShape, type CalendarMarker } from "@/types/calendar-marker";

interface CalendarDayProps {
  marker: CalendarMarker;
  onPress: () => void;
}

export const CalendarDay: FC<CalendarDayProps> = (props) => {
  const { marker, onPress } = props;
  const { date, group, prediction, color } = marker;
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
  const borderWidth = prediction ? 4 : 0;

  return (
    <Pressable
      onPress={onPress}
      style={{
        width: "100%",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          minHeight: 44,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {color !== null && (
          <View
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: single ? "50%" : roundedLeft ? 1 : 0,
              right: single ? undefined : roundedRight ? 1 : 0,
              width: single ? 44 : undefined,
              marginLeft: single ? -22 : 0,
              backgroundColor: prediction ? undefined : color,
              borderColor: prediction ? color : undefined,
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

        <Typography
          variant="bodySmall"
          color={marker.textColor}
          style={{
            fontWeight: marker.selected ? "900" : "400",
            fontSize: marker.selected ? typography.body.fontSize : undefined,
            lineHeight: marker.selected ? 18 : undefined,
            transform: marker.selected ? [{ scale: 1.08 }] : undefined,
          }}
        >
          {date.getDate()}
        </Typography>

        <View
          style={{
            position: "absolute",
            bottom: 6,
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: marker.dotColor,
          }}
        />
      </View>
    </Pressable>
  );
};
