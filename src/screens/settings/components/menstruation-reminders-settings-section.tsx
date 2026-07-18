import { Fragment, type FC, useState } from "react";
import { View } from "react-native";

import {
  Button,
  Dialog,
  Icon,
  IconButton,
  ListRow,
  Slider,
  Stack,
  Switch,
  TextArea,
  Typography,
} from "@/components/ui";
import { useEventsQuery } from "@/db/queries/use-events-query";
import { getMaxMenstruationNotificationDays } from "@/domain/notifications/get-max-menstruation-notification-days";
import { compareTimesAsc, getCurrentTime } from "@/domain/time";
import { ensureReminderPermissions } from "@/notifications/ensure-reminder-permissions";
import { SettingsSectionCard } from "@/screens/settings/components/settings-section-card";
import { TimePickerDialog } from "@/screens/settings/components/time-picker-dialog";
import { useSettingsStore } from "@/stores/settings-store";
import { useTheme } from "@/theme/use-theme";
import { useT } from "@/translation/use-translation";
import { formatHourMinute, type MenstruationNotification } from "@/types";

type RuleTarget = { index?: number } | null;

export const MenstruationRemindersSettingsSection: FC = () => {
  const theme = useTheme();
  const t = useT();
  const { data: events } = useEventsQuery();
  const { settings, updateSettings } = useSettingsStore();
  const maxRuleDay = getMaxMenstruationNotificationDays(events) ?? 0;

  const sortedRules = settings.menstruationNotifications.sort(
    (left, right) =>
      left.dayToMenstruation - right.dayToMenstruation ||
      compareTimesAsc(left.notificationTime, right.notificationTime),
  );
  const showSwitch =
    settings.menstruationNotificationsEnabled ||
    settings.menstruationNotifications.length > 0;
  const showAddButton =
    settings.menstruationNotificationsEnabled ||
    settings.menstruationNotifications.length === 0;

  const [ruleTarget, setRuleTarget] = useState<RuleTarget>(null);
  const [ruleDay, setRuleDay] = useState(0);
  const [ruleMessage, setRuleMessage] = useState("");
  const [pendingRule, setPendingRule] =
    useState<MenstruationNotification | null>(null);
  const timePickerValue = pendingRule?.notificationTime ?? getCurrentTime();

  return (
    <Fragment>
      <SettingsSectionCard
        icon="alarm"
        title={t("settings.menstruationReminders")}
        description={t("settings.notificationsBeforePredictedMenstruation")}
        right={
          showSwitch && (
            <Switch
              value={settings.menstruationNotificationsEnabled}
              onValueChange={(menstruationNotificationsEnabled) => {
                updateSettings({ menstruationNotificationsEnabled });
                if (menstruationNotificationsEnabled) {
                  ensureReminderPermissions();
                }
              }}
            />
          )
        }
      >
        {settings.menstruationNotificationsEnabled && (
          <Stack gap={theme.spacing.md}>
            {sortedRules.map((rule, index) => {
              return (
                <ListRow
                  key={`${rule.dayToMenstruation}-${index}`}
                  title={t("settings.reminderRuleAtTime", {
                    rule: t("settings.reminderRule", {
                      count: rule.dayToMenstruation,
                    }),
                    time: formatHourMinute(rule.notificationTime),
                  })}
                  description={
                    rule.customMessage ??
                    t("settings.useDefaultReminderMessage")
                  }
                  onPress={() => {
                    setRuleTarget({ index });
                    setRuleDay(rule.dayToMenstruation);
                    setRuleMessage(rule.customMessage ?? "");
                  }}
                  right={
                    <IconButton
                      onPress={() =>
                        updateSettings({
                          menstruationNotifications:
                            settings.menstruationNotifications.filter(
                              (_, itemIndex) => itemIndex !== index,
                            ),
                          menstruationNotificationsEnabled:
                            settings.menstruationNotifications.length - 1 > 0
                              ? settings.menstruationNotificationsEnabled
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
              alignItems: sortedRules.length === 0 ? "flex-start" : "flex-end",
              marginTop: theme.spacing.md,
            }}
          >
            <Button
              variant="outline"
              disabled={maxRuleDay === 0}
              leftAccessory={
                <Icon name="plus" color={theme.colors.text} size={16} />
              }
              onPress={() => {
                setRuleTarget({});
                setRuleDay(0);
                setRuleMessage("");
              }}
            >
              {t("settings.addReminder")}
            </Button>
          </View>
        )}

        {showAddButton && maxRuleDay === 0 && (
          <Typography
            variant="bodySmall"
            color={theme.colors.textSecondary}
            style={{ marginTop: theme.spacing.md }}
          >
            {t("settings.tooLittlePredictionInfo")}
          </Typography>
        )}
      </SettingsSectionCard>

      <TimePickerDialog
        visible={pendingRule !== null}
        value={timePickerValue}
        onClose={() => {
          setPendingRule(null);
          setRuleTarget(null);
        }}
        onSave={(time) => {
          if (pendingRule === null || ruleTarget === null) {
            return;
          }

          const nextRule = {
            dayToMenstruation: pendingRule.dayToMenstruation,
            customMessage: pendingRule.customMessage,
            notificationTime: time,
          };
          const nextRules = settings.menstruationNotifications.slice();
          if (ruleTarget.index === undefined) {
            nextRules.push(nextRule);
          } else {
            nextRules[ruleTarget.index] = nextRule;
          }

          updateSettings({
            menstruationNotificationsEnabled: true,
            menstruationNotifications: nextRules,
          });
          ensureReminderPermissions();

          setPendingRule(null);
          setRuleTarget(null);
        }}
      />

      <Dialog
        visible={ruleTarget !== null && pendingRule === null}
        onClose={() => setRuleTarget(null)}
      >
        <Stack gap={theme.spacing.md}>
          <Typography variant="titleSmall">
            {ruleTarget?.index === undefined
              ? t("settings.addReminder")
              : t("settings.editReminder")}
          </Typography>
          <Stack gap={theme.spacing.sm}>
            <Slider
              style={{ width: "100%" }}
              min={0}
              max={Math.max(maxRuleDay, ruleDay)}
              step={1}
              value={ruleDay}
              onValueChange={(value) => setRuleDay(Math.round(value))}
            />
            <Typography
              variant="bodySmall"
              style={{ textAlign: "center" }}
              color={theme.colors.textSecondary}
            >
              {t("settings.reminderRule", { count: ruleDay })}
            </Typography>
          </Stack>
          <TextArea
            label={t("settings.notificationMessage")}
            value={ruleMessage}
            onChangeText={setRuleMessage}
            placeholder={t("settings.notificationMessagePlaceholder")}
          />
          <Stack direction="row" gap={theme.spacing.sm}>
            <View style={{ flex: 1 }}>
              <Button variant="ghost" onPress={() => setRuleTarget(null)}>
                {t("common.cancel")}
              </Button>
            </View>
            <View style={{ flex: 1 }}>
              <Button
                onPress={() => {
                  if (ruleTarget === null) {
                    return;
                  }

                  setPendingRule({
                    dayToMenstruation: ruleDay,
                    customMessage: ruleMessage.trim() || null,
                    notificationTime:
                      ruleTarget.index === undefined
                        ? getCurrentTime()
                        : (settings.menstruationNotifications[ruleTarget.index]
                            ?.notificationTime ?? getCurrentTime()),
                  });
                }}
              >
                {t("common.save")}
              </Button>
            </View>
          </Stack>
        </Stack>
      </Dialog>
    </Fragment>
  );
};
