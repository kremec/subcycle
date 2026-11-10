import { type FC } from "react";
import { Pressable, View } from "react-native";

import { Icon, IconName } from "@/components/ui/icon";
import { Typography } from "@/components/ui/typography";
import { useTheme } from "@/theme/use-theme";
import { t } from "@/translation/use-translation";
import { type Event, MenstruationFlow } from "@/types/event";

interface FlowSelectorProps {
  event: Event;
  onChange: (flow: MenstruationFlow | null) => void;
}

export const FlowSelector: FC<FlowSelectorProps> = (props) => {
  const { event, onChange } = props;
  const theme = useTheme();
  const options = [
    {
      flow: null,
      label: t("calendar.edit.none"),
      icon: IconName.DROPLET_OFF,
      filled: false,
    },
    {
      flow: MenstruationFlow.SPOTTING,
      label: t("calendar.edit.spotting"),
      icon: IconName.CHART_BUBBLE,
      filled: true,
    },
    {
      flow: MenstruationFlow.LIGHT,
      label: t("calendar.edit.light"),
      icon: IconName.DROPLET,
      filled: false,
    },
    {
      flow: MenstruationFlow.MODERATE,
      label: t("calendar.edit.moderate"),
      icon: IconName.DROPLET_HALF,
      filled: true,
    },
    {
      flow: MenstruationFlow.HEAVY,
      label: t("calendar.edit.heavy"),
      icon: IconName.DROPLET,
      filled: true,
    },
  ];
  const value = Math.max(
    0,
    options.findIndex((option) => option.flow !== null && event[option.flow]),
  );

  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={t("calendar.edit.flow")}
      style={{ flexDirection: "row" }}
    >
      {options.map((option, index) => {
        const selected = index === value;
        const color = selected
          ? theme.colors.accent
          : theme.colors.textSecondary;

        return (
          <Pressable
            key={option.flow ?? "none"}
            accessibilityRole="radio"
            accessibilityLabel={option.label}
            accessibilityState={{ selected }}
            onPress={() => onChange(option.flow)}
            style={{
              flex: 1,
              minHeight: 64,
              paddingVertical: theme.spacing.sm,
              borderRadius: 12,
              backgroundColor: selected ? theme.colors.accentSoft : undefined,
              alignItems: "center",
              justifyContent: "center",
              gap: theme.spacing.xxs,
            }}
          >
            <View
              style={{
                width: 24,
                height: 24,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon
                name={option.icon}
                size={20}
                color={color}
                filled={option.filled}
              />
            </View>
            <Typography
              variant="caption"
              color={color}
              numberOfLines={1}
              adjustsFontSizeToFit
              maxFontSizeMultiplier={1.5}
              style={{ width: "100%", textAlign: "center" }}
            >
              {option.label}
            </Typography>
          </Pressable>
        );
      })}
    </View>
  );
};
