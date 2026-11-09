import { type FC } from "react";
import { Pressable, View } from "react-native";

import { Icon, IconName } from "@/components/ui/icon";
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
      <View
        style={{
          width: size,
          height: size,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor:
            color && !prediction
              ? color
              : selected
                ? theme.colors.backgroundSelected
                : undefined,
          borderWidth: selected || (color && prediction) ? 1.5 : 0,
          borderColor: selected ? theme.colors.text : outline,
          borderStyle: prediction && !selected ? "dashed" : "solid",
        }}
      >
        <Typography
          variant="bodySmall"
          allowFontScaling={false}
          style={{
            fontWeight: selected ? "700" : "500",
            paddingBottom: pill ? 4 : 0,
          }}
        >
          {date.getDate()}
        </Typography>
        {pill && (
          <View style={{ position: "absolute", bottom: 2, right: 3 }}>
            <Icon
              name={IconName.PILL}
              size={9}
              filled
              color={theme.colors.calendarPill}
            />
          </View>
        )}
      </View>
    </Pressable>
  );
};
