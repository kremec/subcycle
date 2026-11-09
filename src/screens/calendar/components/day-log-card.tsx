import { type FC } from "react";
import { Pressable, View } from "react-native";

import { Icon, IconName } from "@/components/ui/icon";
import { Typography } from "@/components/ui/typography";
import { symptomGroups } from "@/domain/symptom-groups";
import { EventToggleButton } from "@/screens/calendar/components/event-toggle-button";
import { useTheme } from "@/theme/use-theme";
import { dateFormatter, t } from "@/translation/use-translation";
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
  const flows = [
    { key: MenstruationFlow.LIGHT, label: t("calendar.edit.light") },
    { key: MenstruationFlow.MODERATE, label: t("calendar.edit.moderate") },
    { key: MenstruationFlow.HEAVY, label: t("calendar.edit.heavy") },
    { key: MenstruationFlow.SPOTTING, label: t("calendar.edit.spotting") },
  ];
  const symptomCount = symptomGroups.reduce(
    (count, group) =>
      count + group.types.filter((symptom) => symptoms[symptom.key]).length,
    0,
  );

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
          >
            {t("calendar.cycleDay", { day: dayInCycle })}
          </Typography>
        )}
      </View>
      <View
        style={{
          flexDirection: "row",
          padding: 3,
          borderRadius: 13,
          backgroundColor: theme.colors.backgroundElement,
        }}
      >
        {flows.map((flow) => (
          <EventToggleButton
            key={flow.key}
            label={flow.label}
            active={event[flow.key]}
            onPress={() => onToggle(flow.key)}
          />
        ))}
      </View>
      <View style={{ flexDirection: "row", gap: theme.spacing.xs }}>
        <EventToggleButton
          label={t("calendar.edit.ovulation")}
          icon={IconName.EGG}
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
          }}
        >
          <Icon
            name={IconName.PLUS}
            size={16}
            color={theme.colors.textSecondary}
          />
          <Typography
            variant="captionSemibold"
            color={theme.colors.textSecondary}
            numberOfLines={1}
            adjustsFontSizeToFit
            style={{ flexShrink: 1 }}
          >
            {t("calendar.symptoms.groups.symptoms")}
            {symptomCount > 0 ? ` ${symptomCount}` : ""}
          </Typography>
        </Pressable>
      </View>
    </View>
  );
};
