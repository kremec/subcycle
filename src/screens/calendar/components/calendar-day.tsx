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
  const labels = [dateFormatter.format(date)];
  if (event?.menstruationLight) labels.push(t("calendar.edit.light"));
  if (event?.menstruationModerate) labels.push(t("calendar.edit.moderate"));
  if (event?.menstruationHeavy) labels.push(t("calendar.edit.heavy"));
  if (event?.menstruationSpotting) labels.push(t("calendar.edit.spotting"));
  if (event?.ovulation) labels.push(t("calendar.edit.ovulation"));
  if (color && prediction) labels.push(t("calendar.predicted"));
  if (pill) labels.push(t("calendar.pillTaken"));
  const size = Math.min(40, height - 2);
  const pillSize = Math.min(6, size / 6);
  const joined = marker.joinsPrevious || marker.joinsNext;
  let outline: string = theme.colors.calendarSpottingOutline;
  if (event?.menstruationLight) outline = theme.colors.calendarLightOutline;
  if (event?.menstruationModerate)
    outline = theme.colors.calendarModerateOutline;
  if (event?.menstruationHeavy) outline = theme.colors.calendarHeavyOutline;
  if (event?.ovulation) outline = theme.colors.calendarOvulationOutline;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={labels.join(", ")}
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
            borderColor: outline,
            borderWidth: prediction ? 1.5 : 0,
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
              bottom: 1,
              left: "50%",
              marginLeft: -pillSize / 2,
              width: pillSize,
              height: pillSize,
              borderRadius: theme.radius.full,
              backgroundColor: theme.colors.calendarPill,
            }}
          />
        )}
      </View>
    </Pressable>
  );
};
