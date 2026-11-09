import { type FC } from "react";
import { Pressable, View } from "react-native";

import { Icon, IconName } from "@/components/ui/icon";
import { Typography } from "@/components/ui/typography";
import { symptomGroups } from "@/domain/symptom-groups";
import { EventToggleButton } from "@/screens/calendar/components/event-toggle-button";
import { FlowSelector } from "@/screens/calendar/components/flow-selector";
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
  const symptomCount = symptomGroups.reduce(
    (count, group) =>
      count + group.types.filter((symptom) => symptoms[symptom.key]).length,
    0,
  );
  const symptomsColor =
    symptomCount > 0 ? theme.colors.accent : theme.colors.textSecondary;

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
          variant="bodySemibold"
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
          active={event.ovulation}
          onPress={() => onToggle("ovulation")}
        />
        <EventToggleButton
          label={t("calendar.edit.pill")}
          icon={IconName.PILL}
          active={event.pill}
          onPress={() => onToggle("pill")}
        />
        <Pressable
          onPress={onPressSymptoms}
          accessibilityRole="button"
          accessibilityLabel={t("calendar.symptoms.edit")}
          style={{
            flex: 1,
            minHeight: 44,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            paddingHorizontal: 4,
            borderRadius: 12,
            backgroundColor:
              symptomCount > 0 ? theme.colors.accentSoft : undefined,
          }}
        >
          <Icon name={IconName.PLUS} size={16} color={symptomsColor} />
          <Typography
            variant="captionSemibold"
            color={symptomsColor}
            numberOfLines={1}
            adjustsFontSizeToFit
            maxFontSizeMultiplier={1.5}
            style={{ flexShrink: 1 }}
          >
            {t("calendar.symptoms.groups.symptoms")}
          </Typography>
          {symptomCount > 0 && (
            <Typography
              variant="captionSemibold"
              color={symptomsColor}
              maxFontSizeMultiplier={1.5}
              style={{ flexShrink: 0 }}
            >
              {symptomCount}
            </Typography>
          )}
        </Pressable>
      </View>
    </View>
  );
};
