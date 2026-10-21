import { type FC, useState } from "react";
import { Platform, View } from "react-native";

import { DateTimePicker } from "@expo/ui/community/datetime-picker";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Stack } from "@/components/ui/stack";
import { Typography } from "@/components/ui/typography";
import { timeToDate } from "@/domain/time";
import { useTheme } from "@/theme/use-theme";
import { t } from "@/translation/use-translation";
import { formatHourMinute, type Time } from "@/types";

interface TimePickerDialogProps {
  visible: boolean;
  value: Time;
  onClose: () => void;
  onSave: (time: Time) => void;
}

export const TimePickerDialog: FC<TimePickerDialogProps> = (props) => {
  const { visible, value, onClose, onSave } = props;
  const theme = useTheme();
  const [draftValue, setDraftValue] = useState<Time | null>(null);
  const selectedValue = draftValue ?? value;

  function handleClose() {
    setDraftValue(null);
    onClose();
  }

  function handleSave(time: Time) {
    setDraftValue(null);
    onSave(time);
  }

  if (Platform.OS === "android") {
    if (!visible) return null;
    return (
      <DateTimePicker
        value={timeToDate(value)}
        mode="time"
        is24Hour
        accentColor={theme.colors.accent}
        presentation="dialog"
        positiveButton={{ label: t("common.save") }}
        negativeButton={{ label: t("common.cancel") }}
        onValueChange={(_, nextValue) => {
          handleSave({
            hour: nextValue.getHours(),
            minute: nextValue.getMinutes(),
          });
        }}
        onDismiss={handleClose}
      />
    );
  }

  return (
    <Dialog visible={visible} onClose={handleClose}>
      <Stack gap={theme.spacing.md}>
        <Typography variant="titleSmall">
          {t("settings.notificationTime")}
        </Typography>
        <Typography variant="bodySmall" color={theme.colors.textSecondary}>
          {formatHourMinute(selectedValue)}
        </Typography>
        {visible && (
          <DateTimePicker
            value={timeToDate(selectedValue)}
            mode="time"
            is24Hour
            display="spinner"
            themeVariant={theme.themeName}
            accentColor={theme.colors.accent}
            onValueChange={(_, nextValue) => {
              setDraftValue({
                hour: nextValue.getHours(),
                minute: nextValue.getMinutes(),
              });
            }}
          />
        )}
        <Stack direction="row" gap={theme.spacing.sm}>
          <View style={{ flex: 1 }}>
            <Button variant="ghost" onPress={handleClose}>
              {t("common.cancel")}
            </Button>
          </View>
          <View style={{ flex: 1 }}>
            <Button onPress={() => handleSave(selectedValue)}>
              {t("common.save")}
            </Button>
          </View>
        </Stack>
      </Stack>
    </Dialog>
  );
};
