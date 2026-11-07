import { type FC, useState } from "react";
import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Icon, IconName } from "@/components/ui/icon";
import { Typography } from "@/components/ui/typography";
import { EventToggleButton } from "@/screens/calendar/components/event-toggle-button";
import { useTheme } from "@/theme/use-theme";
import { dateFormatter, formatOrdinal, t } from "@/translation/use-translation";
import { eventSchema, MenstruationFlow, type Event } from "@/types/event";

interface CalendarEditDialogProps {
  event: Event;
  dayInCycle: number | null;
  onClose: () => void;
  onSave: (event: Event) => void;
}

export const CalendarEditDialog: FC<CalendarEditDialogProps> = (props) => {
  const { event, dayInCycle, onClose, onSave } = props;
  const theme = useTheme();
  const [draft, setDraft] = useState(event);

  const toggleGroups = [
    [
      {
        key: MenstruationFlow.LIGHT,
        label: t("calendar.edit.light"),
        icon: IconName.DROPLET,
        filled: false,
        color: theme.colors.calendarMenstruationLight,
      },
      {
        key: MenstruationFlow.MODERATE,
        label: t("calendar.edit.moderate"),
        icon: IconName.DROPLET_HALF,
        filled: true,
        color: theme.colors.calendarMenstruationModerate,
      },
      {
        key: MenstruationFlow.HEAVY,
        label: t("calendar.edit.heavy"),
        icon: IconName.DROPLET,
        filled: true,
        color: theme.colors.calendarMenstruationHeavy,
      },
      {
        key: MenstruationFlow.SPOTTING,
        label: t("calendar.edit.spotting"),
        icon: IconName.CHART_BUBBLE,
        filled: true,
        color: theme.colors.calendarMenstruationLight,
      },
    ],
    [
      {
        key: "ovulation",
        label: t("calendar.edit.ovulation"),
        icon: IconName.EGG,
        filled: false,
        color: theme.colors.calendarOvulation,
      },
    ],
    [
      {
        key: "pill",
        label: t("calendar.edit.pill"),
        icon: IconName.PILL,
        filled: true,
        color: theme.colors.calendarPill,
      },
    ],
  ] as const;

  function toggleEvent(key: MenstruationFlow | "ovulation" | "pill") {
    if (key === "pill") {
      setDraft(eventSchema.parse({ ...draft, pill: !draft.pill }));
      return;
    }

    setDraft(
      eventSchema.parse({
        ...draft,
        menstruationLight: false,
        menstruationModerate: false,
        menstruationHeavy: false,
        menstruationSpotting: false,
        ovulation: false,
        [key]: !draft[key],
      }),
    );
  }

  const save = () => {
    const finalEvent = eventSchema.parse({
      ...draft,
      prediction: false,
    });

    if (event.prediction && !finalEvent.hasFlags) {
      onClose();
      return;
    }

    onSave(finalEvent);
  };

  return (
    <Dialog visible onClose={onClose}>
      <View style={{ gap: theme.spacing.md }}>
        <View>
          <Typography variant="title">
            {t(
              draft.prediction
                ? "calendar.edit.predictionsTitle"
                : "calendar.edit.eventsTitle",
              { date: dateFormatter.format(draft.date) },
            )}
          </Typography>
          {dayInCycle && (
            <Typography variant="bodySmall" color={theme.colors.textSecondary}>
              {t("calendar.edit.dayOfCycle", {
                day: formatOrdinal(dayInCycle),
              })}
            </Typography>
          )}
        </View>

        {toggleGroups.map((toggles) => (
          <View key={toggles[0].key} style={{ gap: theme.spacing.sm }}>
            {toggles.map((toggle) => (
              <EventToggleButton
                key={toggle.key}
                label={toggle.label}
                icon={
                  <Icon
                    name={toggle.icon}
                    color={theme.colors.text}
                    size={18}
                    filled={toggle.filled}
                  />
                }
                active={draft[toggle.key]}
                color={toggle.color}
                onPress={() => toggleEvent(toggle.key)}
              />
            ))}
          </View>
        ))}

        <View style={{ flexDirection: "row", gap: theme.spacing.sm }}>
          <View style={{ flex: 1 }}>
            <Button variant="ghost" onPress={onClose}>
              {t("common.close")}
            </Button>
          </View>
          <View style={{ flex: 1 }}>
            <Button onPress={save}>{t("common.save")}</Button>
          </View>
        </View>
      </View>
    </Dialog>
  );
};
