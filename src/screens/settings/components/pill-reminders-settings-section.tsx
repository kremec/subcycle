import { Fragment, type FC, useState } from "react";
import { View } from "react-native";

import { ListRow } from "@/components/list-row";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { Switch } from "@/components/ui/switch";
import { compareTimesAsc, getCurrentTime } from "@/domain/time";
import { ensureReminderPermissions } from "@/notifications/ensure-reminder-permissions";
import { SettingsSectionCard } from "@/screens/settings/components/settings-section-card";
import { TimePickerDialog } from "@/screens/settings/components/time-picker-dialog";
import { useSettingsStore } from "@/stores/settings-store";
import { useTheme } from "@/theme/use-theme";
import { t } from "@/translation/use-translation";
import { formatHourMinute, type Time } from "@/types/time";

type PickerTarget = { time?: Time } | null;

export const PillRemindersSettingsSection: FC = () => {
  const theme = useTheme();
  const { settings, updateSettings } = useSettingsStore();
  const sortedTimes = settings.pillNotificationTimes.toSorted(compareTimesAsc);
  const showSwitch =
    settings.pillNotificationsEnabled ||
    settings.pillNotificationTimes.length > 0;
  const showAddButton =
    settings.pillNotificationsEnabled ||
    settings.pillNotificationTimes.length === 0;

  const [pickerTarget, setPickerTarget] = useState<PickerTarget>(null);

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
          <View style={{ gap: theme.spacing.md }}>
            {sortedTimes.map((time, index) => {
              return (
                <ListRow
                  key={`${time.hour}-${time.minute}-${index}`}
                  title={t("settings.notificationTime")}
                  description={formatHourMinute(time)}
                  onPress={() => setPickerTarget({ time })}
                  right={
                    <IconButton
                      onPress={() =>
                        updateSettings({
                          pillNotificationTimes:
                            settings.pillNotificationTimes.filter(
                              (item) => item !== time,
                            ),
                          pillNotificationsEnabled:
                            settings.pillNotificationTimes.length > 1,
                        })
                      }
                    >
                      <Icon name="trash" color={theme.colors.text} size={18} />
                    </IconButton>
                  }
                />
              );
            })}
          </View>
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
        value={pickerTarget?.time ?? getCurrentTime()}
        onClose={() => setPickerTarget(null)}
        onSave={(time) => {
          const editedTime = pickerTarget?.time;
          updateSettings({
            pillNotificationsEnabled: true,
            pillNotificationTimes: editedTime
              ? settings.pillNotificationTimes.map((item) =>
                  item === editedTime ? time : item,
                )
              : [...settings.pillNotificationTimes, time],
          });
          ensureReminderPermissions();

          setPickerTarget(null);
        }}
      />
    </Fragment>
  );
};
