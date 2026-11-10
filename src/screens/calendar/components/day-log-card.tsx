import { type FC } from "react";
import { View } from "react-native";

import { IconName } from "@/components/ui/icon";
import { Typography } from "@/components/ui/typography";
import { EventToggleButton } from "@/screens/calendar/components/event-toggle-button";
import { FlowSelector } from "@/screens/calendar/components/flow-selector";
import { SymptomsPreview } from "@/screens/calendar/components/symptoms-preview";
import { useTheme } from "@/theme/use-theme";
import { dateFormatter, t } from "@/translation/use-translation";
import { MenstruationFlow, type Event, type EventFlag } from "@/types/event";
import { type Symptoms } from "@/types/symptom";

interface DayLogCardProps {
  event: Event;
  dayInCycle: number | null;
  symptoms: Symptoms;
  onToggle: (key: EventFlag) => void;
  onChangeFlow: (flow: MenstruationFlow | null) => void;
  onPressSymptoms: () => void;
}

export const DayLogCard: FC<DayLogCardProps> = (props) => {
  const {
    event,
    dayInCycle,
    symptoms,
    onToggle,
    onChangeFlow,
    onPressSymptoms,
  } = props;
  const theme = useTheme();

  return (
    <View
      style={{
        padding: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.lg,
        gap: theme.spacing.sm,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: theme.spacing.sm,
        }}
      >
        <Typography
          variant="bodyStrong"
          numberOfLines={1}
          adjustsFontSizeToFit
          maxFontSizeMultiplier={1.5}
          style={{ flexShrink: 1 }}
        >
          {dateFormatter.format(event.date)}
        </Typography>
        {dayInCycle !== null && (
          <Typography
            variant="caption"
            color={theme.colors.textSecondary}
            numberOfLines={1}
            adjustsFontSizeToFit
            maxFontSizeMultiplier={1.5}
          >
            {t("calendar.cycleDay", { day: dayInCycle })}
          </Typography>
        )}
      </View>
      <FlowSelector event={event} onChange={onChangeFlow} />
      <View style={{ flexDirection: "row", gap: theme.spacing.xs }}>
        <EventToggleButton
          label={t("calendar.edit.ovulation")}
          icon={IconName.FLOWER}
          color={theme.colors.calendarOvulationOutline}
          backgroundColor={theme.colors.calendarOvulation}
          active={event.ovulation}
          onPress={() => onToggle("ovulation")}
        />
        <EventToggleButton
          label={t("calendar.edit.pill")}
          icon={IconName.PILL}
          color={theme.colors.calendarPill}
          backgroundColor={theme.colors.pillSoft}
          active={event.pill}
          onPress={() => onToggle("pill")}
        />
      </View>
      <SymptomsPreview symptoms={symptoms} onPress={onPressSymptoms} />
    </View>
  );
};
