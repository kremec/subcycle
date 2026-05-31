import { DateTimePicker } from "@expo/ui/community/datetime-picker";
import { type FC, useState } from "react";
import { Platform, View } from "react-native";

import { Button, Dialog, Stack, Typography } from "@/components/ui";
import { createTime, timeToDate } from "@/domain/time";
import { useTheme } from "@/theme/use-theme";
import { useT } from "@/translation/use-translation";
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
  const t = useT();
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
    return visible ? (
      <DateTimePicker
        value={timeToDate(value)}
        mode="time"
        is24Hour
        accentColor={theme.colors.accent}
        presentation="dialog"
        positiveButton={{ label: t("common.save") }}
        negativeButton={{ label: t("common.cancel") }}
        onValueChange={(_, nextValue) => {
          handleSave(createTime(nextValue.getHours(), nextValue.getMinutes()));
        }}
        onDismiss={handleClose}
      />
    ) : null;
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
              setDraftValue(
                createTime(nextValue.getHours(), nextValue.getMinutes()),
              );
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
