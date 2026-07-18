import { Fragment, type FC, useState } from "react";
import { View } from "react-native";

import {
  Button,
  Icon,
  IconButton,
  ListRow,
  Stack,
  Switch,
} from "@/components/ui";
import { compareTimesAsc, getCurrentTime } from "@/domain/time";
import { ensureReminderPermissions } from "@/notifications/ensure-reminder-permissions";
import { SettingsSectionCard } from "@/screens/settings/components/settings-section-card";
import { TimePickerDialog } from "@/screens/settings/components/time-picker-dialog";
import { useSettingsStore } from "@/stores/settings-store";
import { useTheme } from "@/theme/use-theme";
import { useT } from "@/translation/use-translation";
import { formatHourMinute } from "@/types";

type PickerTarget = { index?: number } | null;

export const PillRemindersSettingsSection: FC = () => {
  const theme = useTheme();
  const t = useT();
  const { settings, updateSettings } = useSettingsStore();
  const sortedTimes = settings.pillNotificationTimes.sort((left, right) =>
    compareTimesAsc(left, right),
  );
  const showSwitch =
    settings.pillNotificationsEnabled ||
    settings.pillNotificationTimes.length > 0;
  const showAddButton =
    settings.pillNotificationsEnabled ||
    settings.pillNotificationTimes.length === 0;

  const [pickerTarget, setPickerTarget] = useState<PickerTarget>(null);
  const pickerValue =
    pickerTarget?.index === undefined
      ? getCurrentTime()
      : (settings.pillNotificationTimes[pickerTarget.index] ??
        getCurrentTime());

  return (
    <Fragment>
      <SettingsSectionCard
        icon="alarm"
        title={t("settings.pillReminders")}
        description={t("settings.dailyNotifications")}
        right={
          showSwitch && (
            <Switch
              value={settings.pillNotificationsEnabled}
              onValueChange={(pillNotificationsEnabled) => {
                updateSettings({ pillNotificationsEnabled });
                if (pillNotificationsEnabled) {
                  ensureReminderPermissions();
                }
              }}
            />
          )
        }
      >
        {settings.pillNotificationsEnabled && (
          <Stack gap={theme.spacing.md}>
            {sortedTimes.map((time, index) => {
              return (
                <ListRow
                  key={`${time.hour}-${time.minute}-${index}`}
                  title={t("settings.notificationTime")}
                  description={formatHourMinute(time)}
                  onPress={() => setPickerTarget({ index })}
                  right={
                    <IconButton
                      onPress={() =>
                        updateSettings({
                          pillNotificationTimes:
                            settings.pillNotificationTimes.filter(
                              (_, itemIndex) => itemIndex !== index,
                            ),
                          pillNotificationsEnabled:
                            settings.pillNotificationTimes.length - 1 > 0
                              ? settings.pillNotificationsEnabled
                              : false,
                        })
                      }
                    >
                      <Icon name="trash" color={theme.colors.text} size={18} />
                    </IconButton>
                  }
                />
              );
            })}
          </Stack>
        )}

        {showAddButton && (
          <View
            style={{
              alignItems: sortedTimes.length === 0 ? "flex-start" : "flex-end",
              marginTop: theme.spacing.md,
            }}
          >
            <Button
              variant="outline"
              leftAccessory={
                <Icon name="plus" color={theme.colors.text} size={16} />
              }
              onPress={() => setPickerTarget({})}
            >
              {t("settings.addReminder")}
            </Button>
          </View>
        )}
      </SettingsSectionCard>

      <TimePickerDialog
        visible={pickerTarget !== null}
        value={pickerValue}
        onClose={() => setPickerTarget(null)}
        onSave={(time) => {
          if (pickerTarget === null) {
            return;
          }

          const nextTimes = settings.pillNotificationTimes.slice();
          if (pickerTarget.index === undefined) {
            nextTimes.push(time);
          } else {
            nextTimes[pickerTarget.index] = time;
          }

          updateSettings({
            pillNotificationsEnabled: true,
            pillNotificationTimes: nextTimes,
          });
          ensureReminderPermissions();

          setPickerTarget(null);
        }}
      />
    </Fragment>
  );
};
