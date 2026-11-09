import { type FC } from "react";
import { Pressable, View } from "react-native";

import { addDays } from "date-fns";

import { Icon, IconName } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { Typography } from "@/components/ui/typography";
import { useTheme } from "@/theme/use-theme";
import { dateFormatter, t } from "@/translation/use-translation";

interface PartnerDateNavigationProps {
  date: Date;
  dayInCycle: number | null;
  calendarVisible: boolean;
  onChangeDate: (date: Date) => void;
  onToggleCalendar: () => void;
}

export const PartnerDateNavigation: FC<PartnerDateNavigationProps> = (
  props,
) => {
  const { date, dayInCycle, calendarVisible, onChangeDate, onToggleCalendar } =
    props;
  const theme = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.xs,
      }}
    >
      <IconButton
        plain
        accessibilityLabel={t("partner.previousDay")}
        onPress={() => onChangeDate(addDays(date, -1))}
      >
        <Icon
          name={IconName.CHEVRON_LEFT}
          color={theme.colors.textSecondary}
          size={20}
        />
      </IconButton>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t(
          calendarVisible ? "partner.hideCalendar" : "partner.showCalendar",
        )}
        accessibilityState={{ expanded: calendarVisible }}
        onPress={onToggleCalendar}
        style={(state) => ({
          flex: 1,
          minHeight: 52,
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          opacity: state.pressed ? 0.6 : 1,
        })}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.xs,
          }}
        >
          <Icon
            name={IconName.CALENDAR}
            color={theme.colors.textSecondary}
            size={16}
          />
          <Typography
            variant="bodySemibold"
            numberOfLines={1}
            adjustsFontSizeToFit
            maxFontSizeMultiplier={1.5}
          >
            {dateFormatter.format(date)}
          </Typography>
        </View>
        {dayInCycle !== null && (
          <Typography
            variant="caption"
            color={theme.colors.textSecondary}
            maxFontSizeMultiplier={1.5}
          >
            {t("calendar.cycleDay", { day: dayInCycle })}
          </Typography>
        )}
      </Pressable>
      <IconButton
        plain
        accessibilityLabel={t("partner.nextDay")}
        onPress={() => onChangeDate(addDays(date, 1))}
      >
        <Icon
          name={IconName.CHEVRON_RIGHT}
          color={theme.colors.textSecondary}
          size={20}
        />
      </IconButton>
    </View>
  );
};
