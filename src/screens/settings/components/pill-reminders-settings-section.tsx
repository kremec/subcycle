import { Fragment, type FC, useState } from "react";
import { View } from "react-native";

import { ListRow } from "@/components/list-row";
import { Button } from "@/components/ui/button";
import { Icon, IconName } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { Switch } from "@/components/ui/switch";
import { ensureReminderPermissions } from "@/notifications/ensure-reminder-permissions";
import { SettingsSectionCard } from "@/screens/settings/components/settings-section-card";
import { TimePickerDialog } from "@/screens/settings/components/time-picker-dialog";
import { useSettingsStore } from "@/stores/settings-store";
import { useTheme } from "@/theme/use-theme";
import { t } from "@/translation/use-translation";

type PickerTarget = { index?: number } | null;

export const PillRemindersSettingsSection: FC = () => {
  const theme = useTheme();
  const pillNotificationsEnabled = useSettingsStore(
    (state) => state.settings.pillNotificationsEnabled,
  );
  const pillNotificationTimes = useSettingsStore(
    (state) => state.settings.pillNotificationTimes,
  );
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const sortedTimes = pillNotificationTimes
    .map((time, index) => ({ time, index }))
    .sort((left, right) => left.time.localeCompare(right.time));
  const showSwitch =
    pillNotificationsEnabled || pillNotificationTimes.length > 0;
  const showAddButton =
    pillNotificationsEnabled || pillNotificationTimes.length === 0;

  const [pickerTarget, setPickerTarget] = useState<PickerTarget>(null);

  return (
    <Fragment>
      <SettingsSectionCard
        icon={IconName.ALARM}
        title={t("settings.pillReminders")}
        description={t("settings.dailyNotifications")}
        right={
          showSwitch && (
            <Switch
              value={pillNotificationsEnabled}
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
        {pillNotificationsEnabled && (
          <View style={{ gap: theme.spacing.md }}>
            {sortedTimes.map((item) => {
              const { time, index } = item;
              return (
                <ListRow
                  key={`${time}-${index}`}
                  title={t("settings.notificationTime")}
                  description={time}
                  onPress={() => setPickerTarget({ index })}
                  right={
                    <IconButton
                      accessibilityLabel={t("settings.deleteReminder")}
                      onPress={() =>
                        updateSettings({
                          pillNotificationTimes: pillNotificationTimes.filter(
                            (_, itemIndex) => itemIndex !== index,
                          ),
                          pillNotificationsEnabled:
                            pillNotificationTimes.length > 1,
                        })
                      }
                    >
                      <Icon
                        name={IconName.TRASH}
                        color={theme.colors.text}
                        size={18}
                      />
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
                <Icon
                  name={IconName.PLUS}
                  color={theme.colors.text}
                  size={16}
                />
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
        value={
          pickerTarget?.index === undefined
            ? undefined
            : pillNotificationTimes[pickerTarget.index]
        }
        onClose={() => setPickerTarget(null)}
        onSave={(time) => {
          const editedIndex = pickerTarget?.index;
          const times = pillNotificationTimes.map((item, index) => {
            if (index === editedIndex) return time;
            return item;
          });
          if (editedIndex === undefined) times.push(time);

          updateSettings({
            pillNotificationsEnabled: true,
            pillNotificationTimes: times,
          });
          ensureReminderPermissions();

          setPickerTarget(null);
        }}
      />
    </Fragment>
  );
};
