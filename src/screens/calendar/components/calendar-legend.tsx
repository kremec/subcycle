import { type FC } from "react";
import { View } from "react-native";

import { Typography } from "@/components/ui/typography";
import { useTheme } from "@/theme/use-theme";
import { t } from "@/translation/use-translation";

export const CalendarLegend: FC = () => {
  const theme = useTheme();
  const items = [
    {
      label: t("calendar.legend.period"),
      color: theme.colors.calendarMenstruationModerate,
    },
    {
      label: t("calendar.edit.ovulation"),
      color: theme.colors.calendarOvulation,
    },
    {
      label: t("calendar.legend.pill"),
      color: theme.colors.calendarPill,
      pill: true,
    },
    {
      label: t("calendar.legend.predicted"),
      color: "transparent",
      outline: true,
    },
  ];

  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
      }}
    >
      {items.map((item) => (
        <View
          key={item.label}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.xs,
          }}
        >
          <View
            style={{
              width: 12,
              height: item.pill ? 6 : 12,
              borderRadius: theme.radius.full,
              backgroundColor: item.color,
              borderWidth: item.outline ? 1.5 : 0,
              borderColor: theme.colors.accent,
            }}
          />
          <Typography variant="caption" color={theme.colors.textSecondary}>
            {item.label}
          </Typography>
        </View>
      ))}
    </View>
  );
};
