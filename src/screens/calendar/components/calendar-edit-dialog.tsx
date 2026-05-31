import { format } from "date-fns";
import { type FC, useState } from "react";
import { View } from "react-native";

import { Button, Dialog, Icon, Stack, Typography } from "@/components/ui";
import { EventToggleButton } from "@/screens/calendar/components/event-toggle-button";
import { useTheme } from "@/theme/use-theme";
import { formatOrdinal, useT } from "@/translation/use-translation";
import { createDefaultEvent, hasAnyEventFlags, type Event } from "@/types";

interface CalendarEditDialogProps {
  visible: boolean;
  selectedEvent: Event | null;
  dayInCycle: number | null;
  onClose: () => void;
  onSave: (event: Event) => void;
}

export const CalendarEditDialog: FC<CalendarEditDialogProps> = (props) => {
  const { visible, selectedEvent, dayInCycle, onClose, onSave } = props;
  const theme = useTheme();
  const t = useT();
  const [draft, setDraft] = useState<Event | null>(selectedEvent);

  if (!draft) {
    return null;
  }

  const updateDraft = (patch: Partial<Event>) => {
    setDraft({ ...draft, ...patch });
  };

  const save = () => {
    const finalEvent = {
      ...createDefaultEvent(draft.date),
      ...draft,
      prediction: false,
    };

    if (selectedEvent?.prediction && !hasAnyEventFlags(finalEvent)) {
      onClose();
      return;
    }

    onSave(finalEvent);
  };

  return (
    <Dialog visible={visible} onClose={onClose}>
      <Stack gap={theme.spacing.md}>
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

        <Stack gap={theme.spacing.sm}>
          <EventToggleButton
            label={t("calendar.edit.light")}
            icon={<Icon name="droplet" color={theme.colors.text} size={18} />}
            active={draft.menstruationLight}
            color={theme.colors.calendarMenstruationLight}
            onPress={() =>
              updateDraft({
                menstruationLight: !draft.menstruationLight,
                menstruationModerate: false,
                menstruationHeavy: false,
                menstruationSpotting: false,
                ovulation: false,
              })
            }
          />
          <EventToggleButton
            label={t("calendar.edit.moderate")}
            icon={
              <Icon
                name="droplet-half"
                color={theme.colors.text}
                size={18}
                filled
              />
            }
            active={draft.menstruationModerate}
            color={theme.colors.calendarMenstruationModerate}
            onPress={() =>
              updateDraft({
                menstruationLight: false,
                menstruationModerate: !draft.menstruationModerate,
                menstruationHeavy: false,
                menstruationSpotting: false,
                ovulation: false,
              })
            }
          />
          <EventToggleButton
            label={t("calendar.edit.heavy")}
            icon={
              <Icon name="droplet" color={theme.colors.text} size={18} filled />
            }
            active={draft.menstruationHeavy}
            color={theme.colors.calendarMenstruationHeavy}
            onPress={() =>
              updateDraft({
                menstruationLight: false,
                menstruationModerate: false,
                menstruationHeavy: !draft.menstruationHeavy,
                menstruationSpotting: false,
                ovulation: false,
              })
            }
          />
          <EventToggleButton
            label={t("calendar.edit.spotting")}
            icon={
              <Icon
                name="chart-bubble"
                color={theme.colors.text}
                size={18}
                filled
              />
            }
            active={draft.menstruationSpotting}
            color={theme.colors.calendarMenstruationLight}
            onPress={() =>
              updateDraft({
                menstruationLight: false,
                menstruationModerate: false,
                menstruationHeavy: false,
                menstruationSpotting: !draft.menstruationSpotting,
                ovulation: false,
              })
            }
          />
        </Stack>

        <EventToggleButton
          label={t("calendar.edit.ovulation")}
          icon={<Icon name="egg" color={theme.colors.text} size={18} />}
          active={draft.ovulation}
          color={theme.colors.calendarOvulation}
          onPress={() =>
            updateDraft({
              menstruationLight: false,
              menstruationModerate: false,
              menstruationHeavy: false,
              menstruationSpotting: false,
              ovulation: !draft.ovulation,
            })
          }
        />

        <EventToggleButton
          label={t("calendar.edit.pill")}
          icon={<Icon name="pill" color={theme.colors.text} size={18} filled />}
          active={draft.pill}
          color={theme.colors.calendarPill}
          onPress={() => updateDraft({ pill: !draft.pill })}
        />

        <Stack direction="row" gap={theme.spacing.sm}>
          <View style={{ flex: 1 }}>
            <Button variant="ghost" onPress={onClose}>
              {t("common.close")}
            </Button>
          </View>
          <View style={{ flex: 1 }}>
            <Button onPress={save}>{t("common.save")}</Button>
          </View>
        </Stack>
      </Stack>
    </Dialog>
  );
};
