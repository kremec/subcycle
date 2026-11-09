import { type FC } from "react";
import { View } from "react-native";

import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { EventToggleButton } from "@/screens/calendar/components/event-toggle-button";
import { SymptomsOverview } from "@/screens/calendar/components/symptoms-overview";
import { useTheme } from "@/theme/use-theme";
import { dateFormatter, formatOrdinal, t } from "@/translation/use-translation";
import { MenstruationFlow, type Event, type EventFlag } from "@/types/event";
import { type Symptoms } from "@/types/symptom";

interface DayLogCardProps {
  event: Event;
  dayInCycle: number | null;
  symptoms: Symptoms;
  onToggle: (key: EventFlag) => void;
  onPressSymptoms: () => void;
}

export const DayLogCard: FC<DayLogCardProps> = (props) => {
  const { event, dayInCycle, symptoms, onToggle, onPressSymptoms } = props;
  const theme = useTheme();
  const choices = [
    { key: MenstruationFlow.LIGHT, label: t("calendar.edit.light") },
    { key: MenstruationFlow.MODERATE, label: t("calendar.edit.moderate") },
    { key: MenstruationFlow.HEAVY, label: t("calendar.edit.heavy") },
    { key: MenstruationFlow.SPOTTING, label: t("calendar.edit.spotting") },
    { key: "ovulation", label: t("calendar.edit.ovulation") },
    { key: "pill", label: t("calendar.edit.pill") },
  ] as const;

  return (
    <Card style={{ gap: theme.spacing.lg }}>
      <View style={{ gap: theme.spacing.xs }}>
        <Typography variant="titleSmall">
          {dateFormatter.format(event.date)}
        </Typography>
        {dayInCycle !== null && (
          <Typography variant="bodySmall" color={theme.colors.textSecondary}>
            {t("calendar.edit.dayOfCycle", { day: formatOrdinal(dayInCycle) })}
          </Typography>
        )}
      </View>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: theme.spacing.sm,
        }}
      >
        {choices.map((choice) => (
          <EventToggleButton
            key={choice.key}
            label={choice.label}
            active={event[choice.key]}
            onPress={() => onToggle(choice.key)}
          />
        ))}
      </View>
      <SymptomsOverview symptoms={symptoms} onPressEdit={onPressSymptoms} />
    </Card>
  );
};
