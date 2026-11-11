import { type FC } from "react";
import { Pressable, View } from "react-native";

import { Typography } from "@/components/ui/typography";
import { useTheme } from "@/theme/use-theme";
import { dateFormatter, t } from "@/translation/use-translation";
import { type CalendarMarker } from "@/types/calendar-marker";

interface CalendarDayProps {
  marker: CalendarMarker;
  height: number;
  onPress: () => void;
}

export const CalendarDay: FC<CalendarDayProps> = (props) => {
  const { marker, height, onPress } = props;
  const theme = useTheme();
  const { date, prediction, color, selected, pill, event } = marker;
  const label = [
    dateFormatter.format(date),
    event?.menstruationLight && t("calendar.edit.light"),
    event?.menstruationModerate && t("calendar.edit.moderate"),
    event?.menstruationHeavy && t("calendar.edit.heavy"),
    event?.menstruationSpotting && t("calendar.edit.spotting"),
    event?.ovulation && t("calendar.edit.ovulation"),
    color && prediction && t("calendar.predicted"),
    pill && t("calendar.pillTaken"),
  ]
    .filter(Boolean)
    .join(", ");
  const size = Math.min(40, height - 2);
  const joined = marker.joinsPrevious || marker.joinsNext;
  const predictionColor = event?.ovulation
    ? theme.colors.ovulationText
    : theme.colors.menstruationText;
  const textColor =
    !prediction && color === theme.colors.calendarMenstruationHeavy
      ? theme.colors.menstruationHeavyText
      : theme.colors.text;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      style={{
        width: "100%",
        height,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {color !== null && (
        <View
          style={{
            position: "absolute",
            height: size,
            left: joined ? 0 : "50%",
            right: joined ? 0 : undefined,
            width: joined ? undefined : size,
            marginLeft: joined ? 0 : -size / 2,
            backgroundColor: prediction ? undefined : color,
            borderColor: prediction ? predictionColor : color,
            borderWidth: prediction ? 2 : 0,
            borderLeftWidth: marker.joinsPrevious ? 0 : undefined,
            borderRightWidth: marker.joinsNext ? 0 : undefined,
            borderTopLeftRadius: marker.joinsPrevious ? 0 : size * 0.28,
            borderBottomLeftRadius: marker.joinsPrevious ? 0 : size * 0.28,
            borderTopRightRadius: marker.joinsNext ? 0 : size * 0.28,
            borderBottomRightRadius: marker.joinsNext ? 0 : size * 0.28,
          }}
        />
      )}
      <View
        style={{
          width: size,
          height: size,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="bodySmall"
          color={textColor}
          allowFontScaling={false}
          style={{
            fontWeight: selected ? "900" : "400",
            fontSize: selected ? theme.typography.body.fontSize : undefined,
            lineHeight: 18,
            transform: [{ scale: selected ? 1.08 : 1 }],
          }}
        >
          {date.getDate()}
        </Typography>
        {pill && (
          <View
            style={{
              position: "absolute",
              bottom: 3,
              left: "50%",
              marginLeft: -6,
              width: 12,
              height: 3,
              borderRadius: theme.radius.full,
              backgroundColor: theme.colors.calendarPill,
            }}
          />
        )}
      </View>
    </Pressable>
  );
};
