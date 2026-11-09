import { type FC } from "react";
import { Pressable, View } from "react-native";

import { Icon, IconName } from "@/components/ui/icon";
import { Typography } from "@/components/ui/typography";
import { useTheme } from "@/theme/use-theme";
import { dateFormatter, t } from "@/translation/use-translation";
import { type CalendarMarker } from "@/types/calendar-marker";
import { EventKind } from "@/types/event";

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
  const period = event?.kind === EventKind.MENSTRUATION;
  const outline = event?.ovulation
    ? theme.colors.calendarOvulationOutline
    : theme.colors.accent;

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
            left: period ? (marker.joinsPrevious ? 0 : 1) : "50%",
            right: period ? (marker.joinsNext ? 0 : 1) : undefined,
            width: period ? undefined : size,
            marginLeft: period ? 0 : -size / 2,
            backgroundColor: prediction ? undefined : color,
            borderColor: outline,
            borderWidth: prediction ? 1.5 : 0,
            borderLeftWidth: marker.joinsPrevious ? 0 : undefined,
            borderRightWidth: marker.joinsNext ? 0 : undefined,
            borderTopLeftRadius: marker.joinsPrevious ? 0 : size / 2,
            borderBottomLeftRadius: marker.joinsPrevious ? 0 : size / 2,
            borderTopRightRadius: marker.joinsNext ? 0 : size / 2,
            borderBottomRightRadius: marker.joinsNext ? 0 : size / 2,
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
            fontWeight: selected ? "700" : "500",
          }}
        >
          {date.getDate()}
        </Typography>
        {pill && (
          <View style={{ position: "absolute", bottom: 2, right: 3 }}>
            <Icon
              name={IconName.PILL}
              size={size < 36 ? 8 : 10}
              filled
              color={theme.colors.text}
            />
          </View>
        )}
      </View>
    </Pressable>
  );
};
