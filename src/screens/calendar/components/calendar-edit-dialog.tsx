import { type FC, useState } from "react";
import { View } from "react-native";

import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { Typography } from "@/components/ui/typography";
import { EventToggleButton } from "@/screens/calendar/components/event-toggle-button";
import { useTheme } from "@/theme/use-theme";
import { formatOrdinal, t } from "@/translation/use-translation";
import { createDefaultEvent, hasAnyEventFlags, type Event } from "@/types";

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

  const flowToggles = [
    {
      key: "menstruationLight",
      label: t("calendar.edit.light"),
      icon: "droplet",
      filled: false,
      color: theme.colors.calendarMenstruationLight,
    },
    {
      key: "menstruationModerate",
      label: t("calendar.edit.moderate"),
      icon: "droplet-half",
      filled: true,
      color: theme.colors.calendarMenstruationModerate,
    },
    {
      key: "menstruationHeavy",
      label: t("calendar.edit.heavy"),
      icon: "droplet",
      filled: true,
      color: theme.colors.calendarMenstruationHeavy,
    },
    {
      key: "menstruationSpotting",
      label: t("calendar.edit.spotting"),
      icon: "chart-bubble",
      filled: true,
      color: theme.colors.calendarMenstruationLight,
    },
  ] as const;

  // Flow types and ovulation are mutually exclusive.
  const toggleExclusive = (
    key: (typeof flowToggles)[number]["key"] | "ovulation",
  ) => {
    setDraft({
      ...draft,
      menstruationLight: false,
      menstruationModerate: false,
      menstruationHeavy: false,
      menstruationSpotting: false,
      ovulation: false,
      [key]: !draft[key],
    });
  };

  const save = () => {
    const finalEvent = {
      ...createDefaultEvent(draft.date),
      ...draft,
      prediction: false,
    };

    if (event.prediction && !hasAnyEventFlags(finalEvent)) {
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
              { date: format(draft.date, "EEE, dd MMM") },
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

        <View style={{ gap: theme.spacing.sm }}>
          {flowToggles.map((toggle) => (
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
              onPress={() => toggleExclusive(toggle.key)}
            />
          ))}
        </View>

        <EventToggleButton
          label={t("calendar.edit.ovulation")}
          icon={<Icon name="egg" color={theme.colors.text} size={18} />}
          active={draft.ovulation}
          color={theme.colors.calendarOvulation}
          onPress={() => toggleExclusive("ovulation")}
        />

        <EventToggleButton
          label={t("calendar.edit.pill")}
          icon={<Icon name="pill" color={theme.colors.text} size={18} filled />}
          active={draft.pill}
          color={theme.colors.calendarPill}
          onPress={() => setDraft({ ...draft, pill: !draft.pill })}
        />

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
