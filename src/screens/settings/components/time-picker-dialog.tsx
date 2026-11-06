import { type FC, useState } from "react";
import { Platform, View } from "react-native";

import { DateTimePicker } from "@expo/ui/community/datetime-picker";
import { format, parse } from "date-fns";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Typography } from "@/components/ui/typography";
import { useTheme } from "@/theme/use-theme";
import { t } from "@/translation/use-translation";

interface TimePickerDialogProps {
  visible: boolean;
  value: string;
  onClose: () => void;
  onSave: (time: string) => void;
}

export const TimePickerDialog: FC<TimePickerDialogProps> = (props) => {
  const { visible, value, onClose, onSave } = props;
  const theme = useTheme();
  const [draftValue, setDraftValue] = useState<string | null>(null);
  const selectedValue = draftValue ?? value;
  const selectedDate = parse(selectedValue, "HH:mm", 0);

  function handleClose() {
    setDraftValue(null);
    onClose();
  }

  function handleSave(time: string) {
    setDraftValue(null);
    onSave(time);
  }

  if (Platform.OS === "android") {
    if (!visible) return null;
    return (
      <DateTimePicker
        value={selectedDate}
        mode="time"
        is24Hour
        accentColor={theme.colors.accent}
        presentation="dialog"
        positiveButton={{ label: t("common.save") }}
        negativeButton={{ label: t("common.cancel") }}
        onValueChange={(_, nextValue) => {
          handleSave(format(nextValue, "HH:mm"));
        }}
        onDismiss={handleClose}
      />
    );
  }

  return (
    <Dialog visible={visible} onClose={handleClose}>
      <View style={{ gap: theme.spacing.md }}>
        <Typography variant="titleSmall">
          {t("settings.notificationTime")}
        </Typography>
        <Typography variant="bodySmall" color={theme.colors.textSecondary}>
          {selectedValue}
        </Typography>
        {visible && (
          <DateTimePicker
            value={selectedDate}
            mode="time"
            is24Hour
            display="spinner"
            themeVariant={theme.themeName}
            accentColor={theme.colors.accent}
            onValueChange={(_, nextValue) => {
              setDraftValue(format(nextValue, "HH:mm"));
            }}
          />
        )}
        <View style={{ flexDirection: "row", gap: theme.spacing.sm }}>
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
        </View>
      </View>
    </Dialog>
  );
};
