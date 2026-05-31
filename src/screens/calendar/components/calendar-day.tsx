import { type FC } from "react";
import { Pressable, View } from "react-native";

import { Typography } from "@/components/ui";
import { EventGroupShape, type CalendarMarker } from "@/types";

interface CalendarDayProps {
  marker: CalendarMarker;
  onPress: () => void;
}

export const CalendarDay: FC<CalendarDayProps> = (props) => {
  const { marker, onPress } = props;
  const borderWidth = 4;
  const markerSize = 44;
  const actualShape = getVisualShape(marker.actualGroup, marker.date);
  const predictionShape = getVisualShape(marker.predictionGroup, marker.date);
  const backgroundVisible = marker.actualColor !== null;
  const predictionVisible = marker.predictionColor !== null;
  const actualSingle = marker.actualGroup === EventGroupShape.SINGLE;
  const predictionSingle = marker.predictionGroup === EventGroupShape.SINGLE;

  function getVisualShape(
    group: CalendarMarker["actualGroup"],
    date: Date,
  ): {
    marginLeft: number;
    marginRight: number;
    roundedLeft: boolean;
    roundedRight: boolean;
    borderTopLeftRadius: number;
    borderBottomLeftRadius: number;
    borderTopRightRadius: number;
    borderBottomRightRadius: number;
  } {
    const isFirstDayOfWeek = date.getDay() === 1;
    const isLastDayOfWeek = date.getDay() === 0;
    const isFirstDayOfMonth = date.getDate() === 1;
    const isLastDayOfMonth =
      date.getDate() ===
      new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    const roundedLeft =
      group === EventGroupShape.SINGLE ||
      group === EventGroupShape.START ||
      isFirstDayOfWeek ||
      isFirstDayOfMonth;
    const roundedRight =
      group === EventGroupShape.SINGLE ||
      group === EventGroupShape.END ||
      isLastDayOfWeek ||
      isLastDayOfMonth;

    return {
      marginLeft: roundedLeft ? 1 : 0,
      marginRight: roundedRight ? 1 : 0,
      roundedLeft,
      roundedRight,
      borderTopLeftRadius: roundedLeft ? 1000 : 0,
      borderBottomLeftRadius: roundedLeft ? 1000 : 0,
      borderTopRightRadius: roundedRight ? 1000 : 0,
      borderBottomRightRadius: roundedRight ? 1000 : 0,
    };
  }

  return (
    <Pressable
      onPress={onPress}
      style={{
        width: "100%",
        paddingVertical: 0,
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
        {backgroundVisible && (
          <View
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: actualSingle ? "50%" : actualShape.marginLeft,
              right: actualSingle ? undefined : actualShape.marginRight,
              width: actualSingle ? markerSize : undefined,
              marginLeft: actualSingle ? -(markerSize / 2) : 0,
              backgroundColor: marker.actualColor!,
              borderTopLeftRadius: actualShape.borderTopLeftRadius,
              borderBottomLeftRadius: actualShape.borderBottomLeftRadius,
              borderTopRightRadius: actualShape.borderTopRightRadius,
              borderBottomRightRadius: actualShape.borderBottomRightRadius,
            }}
          />
        )}

        {predictionVisible && (
          <View
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: predictionSingle ? "50%" : predictionShape.marginLeft,
              right: predictionSingle ? undefined : predictionShape.marginRight,
              width: predictionSingle ? markerSize : undefined,
              marginLeft: predictionSingle ? -(markerSize / 2) : 0,
              borderTopWidth: borderWidth,
              borderBottomWidth: borderWidth,
              borderLeftWidth: predictionShape.roundedLeft ? borderWidth : 0,
              borderRightWidth: predictionShape.roundedRight ? borderWidth : 0,
              borderColor: marker.predictionColor!,
              borderTopLeftRadius: predictionShape.borderTopLeftRadius,
              borderBottomLeftRadius: predictionShape.borderBottomLeftRadius,
              borderTopRightRadius: predictionShape.borderTopRightRadius,
              borderBottomRightRadius: predictionShape.borderBottomRightRadius,
            }}
          />
        )}

        <Typography
          variant="bodySmall"
          color={marker.textColor}
          style={{
            fontWeight: marker.selected ? "900" : "400",
            fontSize: marker.selected ? 16 : undefined,
            lineHeight: marker.selected ? 18 : undefined,
            transform: marker.selected ? [{ scale: 1.08 }] : undefined,
          }}
        >
          {marker.date.getDate()}
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
